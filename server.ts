import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import cors from "cors";
import crypto from "crypto";
// @ts-ignore
import SmeeClient from "smee-client";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
// Tenta buscar a Service Role Key em várias variações comuns
const supabaseServiceKey = 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("[Server] Configuração do Supabase incompleta. Webhooks podem falhar.");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test connection on startup
(async () => {
  try {
    const { error } = await supabase.from('webhook_events').select('id').limit(1);
    if (error) {
      console.error("[Server] Erro ao conectar ao Supabase:", error.message);
    } else {
      console.log("[Server] Conexão com Supabase estabelecida com sucesso.");
    }
  } catch (e: any) {
    console.error("[Server] Erro crítico na conexão com Supabase:", e.message);
  }
})();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  
  // Middleware para capturar erros de parse do JSON (ex: Nexano enviando JSON inválido)
  app.use((req, res, next) => {
    express.json({ limit: '50mb' })(req, res, (err) => {
      if (err) {
        console.error("[Webhook] Erro de Parse JSON:", err);
        // Tenta salvar o erro no banco
        supabase.from('webhook_events').insert({
          id: `parse_err_${Date.now()}`,
          type: 'json_parse_error',
          payload: { error: err.message, path: req.path, method: req.method }
        }).then(() => {
          return res.status(400).json({ error: "Bad JSON", message: err.message });
        });
      } else {
        next();
      }
    });
  });
  
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  
  // --- WEBHOOK ENDPOINT ---
  // Suporta GET para verificação e POST para dados reais
  const webhookHandler = async (req: express.Request, res: express.Response) => {
    const logId = `req_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    try {
      // 1. LOG ABSOLUTO DE QUALQUER REQUISIÇÃO (GET, POST, etc) ANTES DE TUDO
      // Isso garante que mesmo que o código falhe depois, teremos o registro do que a Nexano enviou.
      await supabase.from('webhook_events').insert({
        id: logId,
        type: `http_${req.method.toLowerCase()}`,
        payload: JSON.parse(JSON.stringify({
          method: req.method,
          url: req.originalUrl,
          headers: req.headers,
          query: req.query,
          body: req.body || 'empty',
          timestamp: new Date().toISOString()
        }))
      });

      // 2. Se for um GET, apenas confirmamos que o endpoint está vivo
      if (req.method === 'GET') {
        return res.status(200).send("Webhook endpoint is active! Use POST to send data.");
      }

      // Nexano pode enviar o token em diferentes headers ou até na query string ou no body
      const webhookToken = 
        req.headers['x-nexano-token'] || 
        req.headers['x-webhook-token'] || 
        req.headers['x-token'] || 
        req.query.token ||
        (req.body && req.body.token);
        
      const expectedToken = process.env.NEXANO_WEBHOOK_TOKEN || 'dsuxblan';
      const payload = req.body || {};
      
      // Log detalhado no console do servidor para depuração em tempo real
      console.log(`[Webhook] Recebido POST em ${new Date().toISOString()}`);
      
      const eventId = payload.transaction?.id || payload.id || payload.event_id || `evt_${Date.now()}`;
      const eventType = payload.event || payload.type || payload.event_type || 'unknown';

      console.log(`[Webhook] Processando evento ${eventId}. Tipo: ${eventType}`);

      // 3. Validar Token
      if (webhookToken !== expectedToken) {
        console.error(`[Webhook] Token inválido. Recebido: ${webhookToken}, Esperado: ${expectedToken}`);
        
        await supabase.from('webhook_events').insert({
          id: `err_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          type: 'token_mismatch',
          payload: { received: webhookToken, expected: expectedToken, eventId }
        });
        
        return res.status(401).json({ error: "Unauthorized", message: "Token mismatch" });
      }

      // 4. Extrair Email do Cliente (suporta vários formatos da Nexano)
      const customerEmail = 
        payload.client?.email ||
        payload.customer?.email || 
        payload.email || 
        payload.data?.email || 
        payload.payload?.customer?.email || 
        payload.user_email ||
        (payload.data?.customer && typeof payload.data.customer === 'string' && payload.data.customer.includes('@') ? payload.data.customer : null);

      console.log(`[Webhook] Evento validado. ID: ${eventId}, Tipo: ${eventType}, Email: ${customerEmail}`);

      // 5. Garantir Idempotência para o evento real
      const { data: existingEvent } = await supabase
        .from('webhook_events')
        .select('id')
        .eq('id', eventId)
        .single();

      if (existingEvent) {
        console.log(`[Webhook] Evento ${eventId} já processado anteriormente.`);
        return res.status(200).json({ status: "already_processed", eventId });
      }

      // 6. Lógica de Criação/Liberação para Compra Aprovada
      const isApproved = 
        eventType.includes('approved') || 
        eventType.includes('paid') || 
        eventType.includes('completed') ||
        eventType.includes('aprovada') ||
        payload.status === 'approved' ||
        payload.status === 'paid' ||
        payload.status === 'completed' ||
        payload.event === 'TRANSACTION_PAID' ||
        payload.event === 'purchase.approved' ||
        // Caso de teste da Nexano que envia apenas o objeto client sem status explícito
        (payload.client && payload.client.email && !payload.status && eventType === 'unknown');

      if (isApproved && customerEmail) {
        console.log(`[Webhook] Detectada compra aprovada para: ${customerEmail}. Verificando usuário...`);
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, blocked')
          .eq('email', customerEmail)
          .single();

        if (profileError || !profile) {
          console.log(`[Webhook] Usuário ${customerEmail} não encontrado. Criando nova conta...`);
          
          const customerCpf = payload.client?.cpf || payload.customer?.cpf || payload.cpf || payload.document || '';
          const cleanCpf = customerCpf.replace(/\D/g, ''); // Apenas números
          const initialPassword = cleanCpf.length >= 6 ? cleanCpf : Math.random().toString(36).slice(-10) + 'A1!';
          
          // Tenta criar o usuário no Auth (requer Service Role Key)
          const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: customerEmail,
            email_confirm: true,
            password: initialPassword, // Senha é o CPF ou aleatória se não tiver CPF
            user_metadata: {
              name: payload.client?.name || payload.customer?.name || payload.name || 'Novo Aluno',
              cpf: cleanCpf
            }
          });

          if (authError) {
            console.error(`[Webhook] Aviso: Não foi possível criar no Auth (provavelmente falta Service Role Key):`, authError.message);
            // Fallback: Cria apenas na tabela profiles para aparecer no painel
            const fallbackId = crypto.randomUUID();
            await supabase.from('profiles').insert([{ 
              id: fallbackId,
              email: customerEmail, 
              is_premium: true,
              blocked: false
            }]);
            console.log(`[Webhook] Perfil fallback criado para ${customerEmail}.`);
          } else if (authData.user) {
            console.log(`[Webhook] Usuário criado no Auth com ID: ${authData.user.id}`);
            // Dá um tempo para a trigger do banco (se existir) criar o profile
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const { error: updateNewProfileError } = await supabase
              .from('profiles')
              .update({ is_premium: true, blocked: false })
              .eq('id', authData.user.id);
              
            if (updateNewProfileError) {
               // Se a trigger não existir, nós mesmos inserimos
               await supabase.from('profiles').insert([{ 
                 id: authData.user.id,
                 email: customerEmail, 
                 is_premium: true,
                 blocked: false
               }]);
               console.log(`[Webhook] Perfil inserido manualmente para ${customerEmail}.`);
            } else {
               console.log(`[Webhook] Perfil atualizado via trigger para ${customerEmail}.`);
            }
          }
        } else {
          console.log(`[Webhook] Usuário ${customerEmail} já existe. Garantindo acesso...`);
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ blocked: false, is_premium: true })
            .eq('id', profile.id);

          if (updateError) {
            console.error(`[Webhook] Erro ao atualizar acesso do usuário: ${updateError.message}`);
          } else {
            console.log(`[Webhook] Acesso garantido/restaurado para ${customerEmail}.`);
          }
        }
      }

      // 7. Lógica de Bloqueio para Compra Recusada/Cancelada
      const isDeclined = 
        eventType.includes('declined') || 
        eventType.includes('refused') || 
        eventType.includes('recusada') ||
        eventType.includes('canceled') ||
        eventType.includes('cancelada') ||
        payload.status === 'declined' ||
        payload.status === 'canceled' ||
        payload.event === 'purchase.declined' ||
        payload.event === 'purchase.canceled';

      if (isDeclined && customerEmail) {
        console.log(`[Webhook] Detectada compra recusada/cancelada para: ${customerEmail}. Iniciando bloqueio...`);
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', customerEmail)
          .single();

        if (profileError || !profile) {
          console.log(`[Webhook] Usuário ${customerEmail} não encontrado na tabela profiles.`);
        } else {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ blocked: true })
            .eq('id', profile.id);

          if (updateError) {
            console.error(`[Webhook] Erro ao atualizar campo 'blocked': ${updateError.message}`);
          } else {
            console.log(`[Webhook] Perfil ${customerEmail} marcado como bloqueado.`);
            try {
              await supabase.auth.admin.signOut(profile.id);
            } catch (authError) {
              console.warn(`[Webhook] Aviso: Não foi possível invalidar sessões de Auth:`, authError);
            }
          }
        }
      }

      // 8. Registrar Evento como Processado com Sucesso
      const { error: finalInsertError } = await supabase.from('webhook_events').insert({
        id: eventId,
        type: eventType,
        payload: payload
      });

      if (finalInsertError) {
        console.error(`[Webhook] Erro ao registrar evento final: ${finalInsertError.message}`);
      }

      return res.status(200).json({ status: "success", eventId });

    } catch (error: any) {
      console.error(`[Webhook] Erro catastrófico no processamento: ${error.message}`);
      
      // Tenta salvar o erro fatal no banco
      try {
        await supabase.from('webhook_events').insert({
          id: `fatal_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          type: 'fatal_error',
          payload: { error: error.message, stack: error.stack }
        });
      } catch (e) {}

      // Retorna 500 para que a Nexano saiba que houve um erro e não marque como "OK"
      return res.status(500).json({ status: "error", message: error.message });
    }
  };

  // Registra as rotas com e sem barra final para evitar 404
  app.all("/api/webhook/nexano", webhookHandler);
  app.all("/api/webhook/nexano/", webhookHandler);

  // Config Check
  app.get("/api/config-check", (req, res) => {
    res.json({ 
      supabaseUrl: !!supabaseUrl,
      supabaseServiceKey: !!supabaseServiceKey && supabaseServiceKey !== process.env.VITE_SUPABASE_ANON_KEY,
      nexanoToken: !!process.env.NEXANO_WEBHOOK_TOKEN,
      nodeEnv: process.env.NODE_ENV,
      usingAnonAsFallback: supabaseServiceKey === process.env.VITE_SUPABASE_ANON_KEY
    });
  });

// Webhook Test Endpoint
app.get("/api/webhook-test", async (req, res) => {
  try {
    const testId = `test_${Date.now()}`;
    const { error } = await supabase.from('webhook_events').insert({
      id: testId,
      type: 'test.manual',
      payload: { message: 'Teste manual via browser', time: new Date().toISOString() }
    });
    
    if (error) throw error;
    res.json({ status: "success", message: "Log de teste criado!", id: testId });
  } catch (e: any) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

// Migration Endpoint for Subcategories Image URL
app.get("/api/migration/subcategories-image", async (req, res) => {
  try {
    console.log("[Migration] Verificando necessidade de migração para image_url em subcategories...");
    
    // Check if column exists
    const { data: columns, error: checkError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'subcategories')
      .eq('column_name', 'image_url');
    
    if (checkError) throw checkError;
    
    if (columns && columns.length > 0) {
      console.log("[Migration] Coluna image_url já existe em subcategories");
      return res.json({ 
        status: "already_exists", 
        message: "A coluna image_url já existe na tabela subcategories" 
      });
    }
    
    // Add the column
    const { error: alterError } = await supabase
      .from('subcategories')
      .select('1')
      .limit(1);
    
    // Use raw SQL to add the column
    const { error: sqlError } = await supabase
      .rpc('exec_sql', { 
        sql: "ALTER TABLE subcategories ADD COLUMN image_url TEXT;"
      });
    
    if (sqlError) {
      console.error("[Migration] Erro ao adicionar coluna image_url:", sqlError);
      return res.status(500).json({ 
        status: "error", 
        message: "Erro ao adicionar coluna image_url", 
        error: sqlError.message 
      });
    }
    
    console.log("[Migration] Coluna image_url adicionada com sucesso em subcategories");
    res.json({ 
      status: "success", 
      message: "Coluna image_url adicionada com sucesso à tabela subcategories" 
    });
    
  } catch (e: any) {
    console.error("[Migration] Erro na migração:", e);
    res.status(500).json({ 
      status: "error", 
      message: e.message 
    });
  }
});

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Inicia o túnel do Smee.io para receber webhooks no ambiente de desenvolvimento
    const smee = new SmeeClient({
      source: 'https://smee.io/nexano-webhook-lucas-dev',
      target: `http://localhost:${PORT}/api/webhook/nexano`,
      logger: console
    });
    smee.start();
    console.log("[Smee] Túnel de Webhook iniciado! Escutando em https://smee.io/nexano-webhook-lucas-dev");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

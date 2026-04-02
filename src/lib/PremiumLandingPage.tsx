import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Zap, Video, TrendingUp, Users, Clock, CheckCircle2, ArrowRight, 
  Star, Shield, Zap as ZapIcon, Flame, Lock, Rocket, Award, AlertCircle, ChevronDown
} from 'lucide-react';

const PremiumLandingPage = ({ 
  onBuy, 
  branding 
}: { 
  onBuy: () => void, 
  branding: any 
}) => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-500 selection:text-black overflow-hidden">
      {/* Hero Section - Ultra Impactante */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(251,146,60,0.3),transparent_40%),radial-gradient(circle_at_85%_15%,rgba(236,72,153,0.2),transparent_40%),radial-gradient(circle_at_55%_85%,rgba(250,204,21,0.15),transparent_40%)] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-orange-600/30 blur-[140px] rounded-full pointer-events-none animate-pulse" />
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-full border border-orange-500/40 backdrop-blur-sm"
            >
              <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
              <span className="text-orange-300 text-sm font-bold tracking-widest uppercase">🔥 OFERTA POR TEMPO LIMITADO</span>
              <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl md:text-8xl font-extrabold text-white tracking-tighter mb-6 leading-tight"
            >
              Crie Conteúdo <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-pink-500 animate-pulse">
                que VENDE
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-300 mb-4 font-light leading-relaxed max-w-3xl mx-auto"
            >
              Prompts prontos + Estratégia comprovada = <span className="font-bold text-orange-400">Renda diária</span>
            </motion.p>

            {/* Social Proof */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-6 mb-12 text-sm text-gray-400"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-500" />
                <span>+2.847 Clientes Ativos</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <span>+R$ 4.2M Faturados</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-orange-500" />
                <span>97% Satisfação</span>
              </div>
            </motion.div>

            {/* Value Props */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto"
            >
               {[
                 { icon: Zap, text: "Acesso Imediato", desc: "Direto após o pagamento" },
                 { icon: Lock, text: "Varios Prompts Prontos", desc: "Atualizados semanalmente" },
                 { icon: Rocket, text: "Suporte 24/7", desc: "Comunidade exclusiva" }
               ].map((item, idx) => (
                <div key={idx} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-orange-500/50 transition-all backdrop-blur-sm">
                  <item.icon className="w-6 h-6 text-orange-500 mb-2 mx-auto" />
                  <p className="font-bold text-sm">{item.text}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons - Multiple variants */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              {/* Primary CTA */}
              <button 
                onClick={onBuy}
                className="px-10 py-5 bg-gradient-to-r from-orange-500 via-amber-400 to-pink-500 hover:brightness-110 text-black font-bold text-lg rounded-xl transition-all flex items-center justify-center gap-3 group shadow-[0_25px_70px_rgba(244,114,35,0.4)] hover:shadow-[0_35px_100px_rgba(244,114,35,0.5)] transform hover:scale-105"
              >
                <Rocket className="w-6 h-6" />
                Liberar Acesso Agora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Risk Reversal */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-green-500/10 border border-green-500/20 rounded-lg text-sm text-green-400 font-semibold backdrop-blur-sm"
            >
              <Shield className="w-5 h-5" />
              Garantia 100% de Satisfação | 7 Dias de Reembolso
            </motion.div>

            {/* Hero Image - if available */}
            {branding?.landing_images?.hero && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="mt-20 relative max-w-5xl mx-auto group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 blur-2xl rounded-3xl pointer-events-none group-hover:blur-3xl transition-all" />
                <div className="relative aspect-video rounded-3xl overflow-hidden border border-orange-500/30 shadow-2xl shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-all">
                  <img 
                    src={branding.landing_images.hero} 
                    alt="Plataforma Preview" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Pain Points & Solutions */}
      <section className="py-20 lg:py-32 relative overflow-hidden bg-gradient-to-b from-zinc-950 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.05),transparent_70%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
              O Problema de <span className="text-orange-400">Todo Criador</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Você gasta horas tentando criar conteúdo que venda, mas os resultados não vêm...
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Pain Points */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-red-400 flex items-center gap-3">
                <AlertCircle className="w-6 h-6" /> Seus Problemas
              </h3>
              {[
                "❌ Não sabe por onde começar",
                "❌ Prompts genéricos que não convertem",
                "❌ Perde horas pesquisando técnicas",
                "❌ Concorrência acirrada",
                "❌ Sem direcionamento claro"
              ].map((problem, idx) => (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="text-gray-300 flex items-center gap-3 text-lg"
                >
                  {problem}
                </motion.p>
              ))}
            </motion.div>

            {/* Solutions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-green-400 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6" /> Nossas Soluções
              </h3>
              {[
                "✅ Estratégia pronta para usar",
                "✅ Prompts otimizados para conversão",
                "✅ Aulas + comunidade exclusiva",
                "✅ Vantagem competitiva comprovada",
                "✅ Suporte 24/7 dedicado"
              ].map((solution, idx) => (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="text-gray-300 flex items-center gap-3 text-lg font-medium"
                >
                  {solution}
                </motion.p>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
              O Que Você Recebe
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Tudo que você precisa para começar a faturar HOJE
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: "Grande Variedade de Prompts",
                desc: "Biblioteca completa com categorias diversas de prompts testados e otimizados para máxima conversão",
                color: "from-orange-500 to-amber-500"
              },
              {
                icon: Video,
                title: "Aulas Práticas",
                desc: "Treinamento em vídeo com estratégias reais usadas por top creators",
                color: "from-pink-500 to-rose-500"
              },
              {
                icon: Users,
                title: "Links das Ferramentas",
                desc: "Acesso direto às melhores ferramentas e plataformas de IA para potencializar seus resultados",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: TrendingUp,
                title: "Analytics & Métricas",
                desc: "Dashboard com dados de desempenho dos seus prompts em tempo real",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Rocket,
                title: "Templates Prontos",
                desc: "Estruturas testadas que geram conversão automática",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Award,
                title: "Certificação Official",
                desc: "Credencial que você pode usar para vender seus serviços",
                color: "from-yellow-500 to-amber-500"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative p-8 bg-gradient-to-br from-zinc-900/50 to-black border border-zinc-800 rounded-2xl hover:border-orange-500/50 transition-all duration-300 hover:shadow-[0_20px_60px_rgba(244,114,35,0.2)]"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl blur-xl pointer-events-none`} />
                
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} p-3 mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-full h-full text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-orange-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Generated Images Showcase */}
      <section className="py-20 lg:py-32 relative overflow-hidden bg-gradient-to-b from-black to-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.05),transparent_70%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
              Imagens Geradas Com Nossos <span className="text-orange-400">Prompts</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Veja a qualidade e criatividade dos conteúdos gerados por nossos criadores
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                img: "https://images.unsplash.com/photo-1618983479302-1461b3b67f1e?w=600&h=400&fit=crop",
                title: "Design Criativo"
              },
              {
                img: "https://images.unsplash.com/photo-1611339555312-e607c04352fa?w=600&h=400&fit=crop",
                title: "Arte Digital"
              },
              {
                img: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&h=400&fit=crop",
                title: "Conteúdo Visual"
              },
              {
                img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
                title: "Produção Premium"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative rounded-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 blur-2xl rounded-2xl pointer-events-none group-hover:blur-3xl transition-all" />
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-orange-500/30 shadow-2xl shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-all">
                  <img 
                    src={item.img} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-start p-6">
                    <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Dashboard Showcase */}
      {branding?.landing_images?.dashboard && (
        <section className="py-20 lg:py-32 relative overflow-hidden bg-gradient-to-b from-zinc-950 to-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.08),transparent_70%)] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
                Seu Painel de <span className="text-orange-400">Controle</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Interface intuitiva e poderosa para gerenciar seus prompts e acompanhar seus resultados em tempo real
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 to-pink-500/30 blur-3xl rounded-3xl pointer-events-none group-hover:blur-4xl transition-all" />
              <div className="relative aspect-video rounded-3xl overflow-hidden border-2 border-orange-500/40 shadow-2xl shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-all">
                <img 
                  src={branding.landing_images.dashboard} 
                  alt="Dashboard da Plataforma" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Testimonials - Social Proof */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-black to-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(251,146,60,0.05),transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
              Clientes Conquistando <span className="text-orange-400">Resultados</span>
            </h2>
            <p className="text-xl text-gray-400">Veja o que os criadores estão ganhando</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Marina Silva",
                result: "+R$ 12.500/mês",
                testimonial: "Comecei sem saber nada. Em 2 meses já estava faturando consistente. Os prompts funcionam!",
                avatar: "👩‍💼"
              },
              {
                name: "Carlos Mendes",
                result: "+R$ 18.300/mês",
                testimonial: "A comunidade é incrível. Aprendo algo novo todo dia. Melhor investimento que fiz.",
                avatar: "👨‍💼"
              },
              {
                name: "Ana Costa",
                result: "+R$ 8.900/mês",
                testimonial: "Dei início a meu negócio do zero. Agora tenho múltiplas fontes de renda.",
                avatar: "👱‍♀️"
              }
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-orange-500/30 transition-all backdrop-blur-sm hover:bg-zinc-800/50"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-orange-500 font-bold">{testimonial.result}</p>
                  </div>
                </div>
                
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-gray-300 leading-relaxed italic">
                  "{testimonial.testimonial}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Limited Time Offer Banner */}
      <section className="py-12 bg-gradient-to-r from-orange-600/20 via-pink-600/20 to-orange-600/20 border-y border-orange-500/20 relative overflow-hidden">
        <div className="absolute inset-0 animate-pulse opacity-30" />
        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-center"
          >
            <p className="text-sm font-bold text-orange-300 uppercase tracking-widest mb-2">⏰ OFERTA TERMINA EM</p>
            <h3 className="text-4xl md:text-5xl font-extrabold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
                48 HORAS
              </span>
            </h3>
            <p className="text-lg text-gray-300 mb-6">
              Apenas <span className="font-bold text-orange-400">3 vagas</span> restantes com <span className="font-bold">50% de desconto</span> + bônus exclusivos
            </p>
            <button 
              onClick={onBuy}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:brightness-110 text-black font-bold rounded-xl transition-all shadow-[0_15px_40px_rgba(244,114,35,0.4)] hover:shadow-[0_25px_60px_rgba(244,114,35,0.5)]"
            >
              🔥 PEGAR OFERTA AGORA 🔥
            </button>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
              Dúvidas Frequentes
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: "Como começo a faturar imediatamente?",
                a: "Você recebe acesso imediato após o pagamento. Os prompts já estão prontos para usar. Comece hoje mesmo!"
              },
              {
                q: "E se não gostar? Há garantia?",
                a: "100% garantia! Se não ficar satisfeito em 7 dias, devolvemos seu dinheiro. Sem perguntas."
              },
              {
                q: "Preciso de conhecimento técnico?",
                a: "Não! Os prompts funcionam com qualquer IA. Temos aulas que explicam tudo passo a passo."
              },
              {
                q: "Quanto tempo leva para ver resultados?",
                a: "Muitos ganham na primeira semana! Tudo depende do seu esforço. A estrutura já funciona comprovada."
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden hover:border-orange-500/30 transition-all"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                  className="w-full p-6 flex items-center justify-between hover:bg-zinc-800/50 transition-all"
                >
                  <span className="text-lg font-bold text-left text-white">
                    {item.q}
                  </span>
                  <ChevronDown 
                    className={`w-6 h-6 text-orange-500 transition-transform ${expandedFAQ === idx ? 'rotate-180' : ''}`}
                  />
                </button>
                
                <AnimatePresence>
                  {expandedFAQ === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 text-gray-400 border-t border-zinc-800"
                    >
                      {item.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-black to-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.15),transparent_70%)] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-7xl font-extrabold mb-6">
              Pronto para <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">Faturar?</span>
            </h2>
            
            <p className="text-xl text-gray-400 mb-12 leading-relaxed">
              Não deixe essa oportunidade passar. Junte-se aos criadores que já estão ganhando <span className="font-bold text-orange-400">consistentemente</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                onClick={onBuy}
                className="px-12 py-6 bg-gradient-to-r from-orange-500 via-amber-400 to-pink-500 hover:brightness-110 text-black font-bold text-lg rounded-2xl transition-all shadow-[0_30px_80px_rgba(244,114,35,0.4)] hover:shadow-[0_40px_120px_rgba(244,114,35,0.5)] transform hover:scale-105 flex items-center justify-center gap-3"
              >
                <Rocket className="w-7 h-7" />
                Começar Agora
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>

            <p className="text-sm text-gray-500 font-semibold">
              ✨ Garantia 100% de Satisfação | Reembolso em 7 dias | Suporte 24/7 ✨
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PremiumLandingPage;

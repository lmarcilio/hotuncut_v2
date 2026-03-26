import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Nexano Webhook Endpoint
  app.post("/api/webhook/nexano", async (req, res) => {
    const payload = req.body;
    console.log("Nexano Webhook Received:", payload);

    // Common Nexano payload structure (assuming 'status' and 'email')
    // You should verify the signature if Nexano provides one
    const { status, email, customer_email } = payload;
    const userEmail = email || customer_email;

    if (status === "approved" || status === "paid" || status === "completed") {
      try {
        // Update user access in Supabase
        // We assume a 'profiles' table with 'email' and 'is_premium' fields
        const { error } = await supabase
          .from("profiles")
          .update({ is_premium: true, updated_at: new Date() })
          .eq("email", userEmail);

        if (error) {
          console.error("Error updating user in Supabase:", error);
          return res.status(500).json({ error: "Database update failed" });
        }

        console.log(`Access granted to: ${userEmail}`);
        return res.status(200).json({ success: true });
      } catch (err) {
        console.error("Webhook processing error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
    }

    res.status(200).json({ message: "Webhook received but no action taken" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
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

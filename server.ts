import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', store: 'Fagun Luxury Store', timestamp: new Date().toISOString() });
  });

  // API Stripe Payment Intent simulation or integration
  app.post('/api/create-payment-intent', (req, res) => {
    const { amount, currency } = req.body;
    
    // If STRIPE_SECRET_KEY is present in env, real Stripe intent can be created
    if (process.env.STRIPE_SECRET_KEY) {
      // Real Stripe lazy initialization or mock
    }

    res.json({
      clientSecret: `pi_test_secret_${Math.random().toString(36).substring(2)}`,
      amount: amount || 41000,
      currency: currency || 'usd',
      status: 'requires_payment_method',
      testInstructions: {
        approved: '4242 4242 4242 4242',
        declined: '4000 0000 0002 0002',
        gatewayError: '4000 0000 0003 0003'
      }
    });
  });

  // Vite middleware for development or Static server for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

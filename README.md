Order Execution Engine
A high-performance order execution engine with DEX routing and real-time WebSocket updates.

Live Demo
Live API URL: https://order-execution-engine-production-e5ab.up.railway.app

Quick Test:
bash
# Health check
curl https://order-execution-engine-production-e5ab.up.railway.app/health

# Submit order
curl -X POST https://order-execution-engine-production-e5ab.up.railway.app/api/orders/execute \
  -H "Content-Type: application/json" \
  -d '{"tokenIn":"SOL","tokenOut":"USDC","amount":0.1}'
API Endpoints
Endpoint	Method	Description
/health	GET	API health status
/api/orders/execute	POST	Submit new market order
/api/orders/:orderId	GET	Get order status
/ws/orders/:orderId	GET	WebSocket real-time updates
Features
Market order execution with immediate fulfillment

DEX routing between Raydium & Meteora

Real-time WebSocket status updates

Concurrent order processing (10+ orders simultaneously)

Rate limiting (100 orders/minute)

Exponential backoff retry logic

Production deployment on Railway

Why Market Orders?
We chose market orders for simplicity and immediate execution. The engine can be extended to:

Limit Orders: Add price monitoring service that triggers execution when target price is reached

Sniper Orders: Add event listeners for token launches with immediate market order execution

TWAP Orders: Time-weighted average price execution over specified intervals

Deployment
Platform: Railway

Status: Production Ready

Auto-deploy: On git push to main branch

URL: https://order-execution-engine-production-e5ab.up.railway.app

Local Development
bash
# 1. Clone repository
git clone https://github.com/nikhildeshmukh454/order-execution-engine
cd order-execution-engine

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Run tests
npm test
Testing
bash
# Run all tests (10+ unit/integration tests)
npm test

# Test specific endpoints
curl http://localhost:3000/health
curl -X POST http://localhost:3000/api/orders/execute \
  -H "Content-Type: application/json" \
  -d '{"tokenIn":"SOL","tokenOut":"USDC","amount":0.1}'
WebSocket Testing
bash
# Install wscat
npm install -g wscat

# Connect to WebSocket
wscat -c wss://order-execution-engine-production-e5ab.up.railway.app/ws/orders/your-order-id
Architecture
Framework: Node.js + Fastify

Real-time: WebSocket connections

Queue: In-memory concurrent processing

Deployment: Railway (auto-scaling)

Monitoring: Health checks + structured logging

Live Demo: https://order-execution-engine-production-e5ab.up.railway.app
Source Code: https://github.com/nikhildeshmukh454/order-execution-engine


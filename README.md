##Order Execution Engine##

1. What This Project Is

This project is a market order execution engine that routes trades across DEXs (Raydium and Meteora) and provides real-time WebSocket updates.
It can execute multiple orders concurrently, apply rate limiting, and retry failed requests using exponential backoff.
It is deployed in production on Railway.

2. Installation
git clone https://github.com/nikhildeshmukh454/order-execution-engine
cd order-execution-engine
npm install

3. Running the Server
Development
npm run dev


Server runs on:
http://localhost:3000

Production
npm run build
npm start

4. Running Tests
npm test

5. How to Use the API
Health Check
curl http://localhost:3000/health

Execute Market Order
curl -X POST http://localhost:3000/api/orders/execute \
  -H "Content-Type: application/json" \
  -d '{"tokenIn":"SOL","tokenOut":"USDC","amount":0.1}'

Get Order Status
curl http://localhost:3000/api/orders/<orderId>

WebSocket Updates

Install wscat:

npm install -g wscat


Connect:

wscat -c ws://localhost:3000/ws/orders/<orderId>

6. Important Notes

The engine currently supports only market orders.

Routing is performed between Raydium and Meteora.

Concurrency and retry logic are built into the order processor.

Rate limit is set to 100 orders per minute.

The engine is deployed on Railway for production use.

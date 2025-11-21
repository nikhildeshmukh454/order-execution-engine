# Order Execution Engine

A high-performance order execution engine with DEX routing and real-time WebSocket updates.

## Features
- Market order execution
- DEX routing between Raydium & Meteora
- Real-time WebSocket status updates
- Concurrent order processing (10 orders)
- Rate limiting (100 orders/minute)
- Exponential backoff retry logic

## Why Market Orders?
We chose market orders for simplicity and immediate execution. The engine can be extended to:
- **Limit Orders**: Add price monitoring service that triggers execution when target price is reached
- **Sniper Orders**: Add event listeners for token launches with immediate market order execution

## Setup
1. Clone repository
2. Run `npm install`
3. Run `npm run dev`

## API Endpoints
- `POST /api/orders/execute` - Submit order
- `GET /api/orders/:orderId` - Get order status  
- `GET /ws/orders/:orderId` - WebSocket updates
- `GET /health` - Health check

## Testing
Run `npm test` for 10+ unit/integration tests
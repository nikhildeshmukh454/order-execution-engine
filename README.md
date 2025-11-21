## *Order Execution Engine*



# 1. What This Project Is

This project is a market order execution engine that routes trades across DEXs (Raydium and Meteora) and provides real-time WebSocket updates.

It can execute multiple orders concurrently, apply rate limiting, and retry failed requests using exponential backoff.

It is deployed in production on Railway.

# 2.Installation
git clone https://github.com/nikhildeshmukh454/order-execution-engine

cd order-execution-engine

npm install

# 3.Order Execution Engine

A high-performance order execution engine with DEX routing and real-time WebSocket updates.

# 4.Live Demo

API Base URL:

https://order-execution-engine-production-e5ab.up.railway.app

# Quick Test
curl https://order-execution-engine-production-e5ab.up.railway.app/health

curl -X POST https://order-execution-engine-production-e5ab.up.railway.app/api/orders/execute \
  -H "Content-Type: application/json" \
  -d '{"tokenIn":"SOL","tokenOut":"USDC","amount":0.1}'

# API Endpoints
Endpoint	Method	Description
/health	GET	API health status
/api/orders/execute	POST	Submit new market order
/api/orders/:orderId	GET	Get order status
/ws/orders/:orderId	GET	WebSocket real-time updates
Features

Market order execution with immediate fulfillment
DEX routing between Raydium and Meteora
Real-time WebSocket status updates
Concurrent order processing (10+ orders simultaneously)
Rate limiting (100 orders per minute)
Exponential backoff retry logic

# Production deployment on Railway

Why Market Orders

Market orders provide the simplest and fastest execution flow.

The system can be extended to support:

Limit Orders (add price tracking and triggers)

Sniper Orders (trigger on token launch events)

TWAP Orders (time-weighted execution over intervals)

# Deployment

Platform: Railway

Status: Production ready

Auto-deploy: On push to main branch

URL: https://order-execution-engine-production-e5ab.up.railway.app

# Local Development
git clone https://github.com/nikhildeshmukh454/order-execution-engine

cd order-execution-engine

npm install
npm run dev
npm test

# Testing
npm test
curl http://localhost:3000/health
curl -X POST http://localhost:3000/api/orders/execute \
  -H "Content-Type: application/json" \
  -d '{"tokenIn":"SOL","tokenOut":"USDC","amount":0.1}'

# WebSocket Testing
npm install -g wscat

wscat -c wss://order-execution-engine-production-e5ab.up.railway.app/ws/orders/your-order-id

# Architecture

Node.js + Fastify

WebSocket real-time connections

In-memory concurrent processing queue

Deployment on Railway

Health checks and structured logs

# Repository


Source Code: https://github.com/nikhildeshmukh454/order-execution-engine

Live Demo: https://order-execution-engine-production-e5ab.up.railway.app


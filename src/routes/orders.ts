import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { simpleQueue } from '../services/simpleQueue';
import { DatabaseService } from '../services/database';
import { WebSocketService } from '../services/websocket';
import { Order } from '../types';

interface OrderRequest {
  tokenIn: string;
  tokenOut: string;
  amount: number;
}

const databaseService = new DatabaseService();
const wsService = new WebSocketService();

export async function orderRoutes(fastify: FastifyInstance) {
  // POST endpoint for order submission
  // Add this new route BEFORE your existing POST endpoint
  // WebSocket upgrade endpoint - MUST be GET method
  fastify.get('/api/orders/execute-ws', { 
    websocket: true 
  }, (connection, req: FastifyRequest) => {
    
    connection.socket.on('message', async (message) => {
      try {
        // Process EVERY message as an order (remove the first-message check)
        const orderData = JSON.parse(message.toString());
        const { tokenIn, tokenOut, amount } = orderData;

        // Validate input
        if (!tokenIn || !tokenOut || !amount || amount <= 0) {
          connection.socket.send(JSON.stringify({
            error: 'Invalid order data. tokenIn, tokenOut, and positive amount are required.'
          }));
          return; // Don't close connection, just send error
        }

        // Create order
        const orderId = uuidv4();
        const order: Order = {
          id: orderId,
          type: 'market',
          tokenIn,
          tokenOut,
          amount,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Save to database
        await databaseService.createOrder(order);

        // Send initial status via WebSocket
        connection.socket.send(JSON.stringify({
          orderId,
          status: 'pending',
          message: 'Order received and queued for execution'
        }));

        // Register this WebSocket connection for updates
        wsService.addClient(orderId, connection);

        // Add to processing queue
        await simpleQueue.add(order);
        
      } catch (error) {
        console.error('WebSocket order submission error:', error);
        connection.socket.send(JSON.stringify({
          error: 'Failed to submit order'
        }));
        // Don't close connection on error
      }
    });

    connection.socket.on('close', () => {
      // Clean up if needed
    });
  });
  fastify.post('/api/orders/execute', async (request: FastifyRequest<{ Body: OrderRequest }>, reply: FastifyReply) => {
    try {
      const { tokenIn, tokenOut, amount } = request.body;

      // Validate input
      if (!tokenIn || !tokenOut || !amount || amount <= 0) {
        return reply.status(400).send({
          error: 'Invalid order data. tokenIn, tokenOut, and positive amount are required.'
        });
      }

      // Create order
      const orderId = uuidv4();
      const order: Order = {
        id: orderId,
        type: 'market',
        tokenIn,
        tokenOut,
        amount,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save to database
      await databaseService.createOrder(order);

      // Add to processing queue
      await simpleQueue.add(order);

      return reply.send({
        orderId,
        status: 'pending',
        message: 'Order received and queued for execution'
      });

    } catch (error) {
      console.error('Order submission error:', error);
      return reply.status(500).send({
        error: 'Failed to submit order'
      });
    }
  });

  // Separate WebSocket endpoint for status updates
  fastify.get('/ws/orders/:orderId', { websocket: true }, (connection, req) => {
    const orderId = (req.params as any).orderId;
    
    if (orderId) {
      wsService.addClient(orderId, connection);
      
      // Fix: use connection.socket.send instead of connection.send
      connection.socket.send(JSON.stringify({
        orderId,
        status: 'connected',
        message: 'WebSocket connection established'
      }));

      connection.socket.on('message', (message) => {
        console.log('WebSocket message:', message.toString());
      });

      connection.socket.on('close', () => {
        wsService.removeClient(orderId);
      });
    }
  });

  // Get order status
  fastify.get('/api/orders/:orderId', async (request: FastifyRequest<{ Params: { orderId: string } }>, reply: FastifyReply) => {
    const order = await databaseService.getOrder(request.params.orderId);
    
    if (!order) {
      return reply.status(404).send({ error: 'Order not found' });
    }
    
    return order;
  });
}
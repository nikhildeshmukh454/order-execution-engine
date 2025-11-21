import Fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import fastifyFormbody from '@fastify/formbody'; // ✅ ADD THIS
import { orderRoutes } from './routes/orders';
import { simpleQueue } from './services/simpleQueue';

console.log('🚀 Order Execution Engine starting...');

// Create Fastify instance
const fastify = Fastify({
  logger: true
});

// Register plugins
fastify.register(fastifyWebsocket);
fastify.register(fastifyFormbody); // ✅ ADD THIS LINE - JSON body parser

// Register routes
fastify.register(orderRoutes);

// Health check
fastify.get('/health', async () => {
  return { status: 'OK', timestamp: new Date().toISOString() };
});

// Start server function
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🚀 Order Execution Engine running on http://localhost:3000');
    console.log('📊 Health check: http://localhost:3000/health');
    console.log('📝 API Docs:');
    console.log('   POST /api/orders/execute - Submit order');
    console.log('   GET  /api/orders/:orderId - Get order status');
    console.log('   GET  /ws/orders/:orderId - WebSocket updates');
  } catch (err) {
    console.error('Server error:', err);
    process.exit(1);
  }
};

// Export for tests
export { fastify };

// Only start if not in test environment
if (require.main === module) {
  start();
}

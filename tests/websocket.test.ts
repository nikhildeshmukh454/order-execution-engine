describe('WebSocket Configuration', () => {
  test('WebSocket route should be registered', async () => {
    const { fastify } = await import('../src/server');
    const app = fastify;
    await app.ready();
    
    const routes = app.printRoutes();
    expect(routes).toContain('ws/orders/');
    
    await app.close();
  });

  test('WebSocket service should have required methods', () => {
    const { WebSocketService } = require('../src/services/websocket');
    const service = new WebSocketService();
    
    expect(typeof service.addClient).toBe('function');
    expect(typeof service.sendStatus).toBe('function');
    expect(typeof service.removeClient).toBe('function');
  });

  test('WebSocket service basic functionality', () => {
    const { WebSocketService } = require('../src/services/websocket');
    const service = new WebSocketService();
    
    // Create the EXACT mock structure that matches WebSocketService
    const mockConn = { 
      send: jest.fn(), // DIRECT send method (not socket.send)
      socket: {
        on: jest.fn()
      }
    };
    
    // Test that we can add and remove clients without errors
    service.addClient('test-order-1', mockConn);
    service.sendStatus('test-order-1', 'test', 'message');
    service.removeClient('test-order-1');
    
    // Verify send was called
    expect(mockConn.send).toHaveBeenCalled();
  });
});
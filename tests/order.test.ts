const request = require('supertest');

describe('Order Execution Engine', () => {
  let app: any;

  beforeAll(async () => {
    const { fastify } = await import('../src/server');
    app = fastify;
    await app.ready();
  });

  afterAll(async () => {
    // Wait longer for all queue processing to complete
    await new Promise(resolve => setTimeout(resolve, 3000));
    await app.close();
  });

  test('POST /api/orders/execute - should create order', async () => {
    const response = await request(app.server)
      .post('/api/orders/execute')
      .send({
        tokenIn: 'SOL',
        tokenOut: 'USDC',
        amount: 1.5
      })
      .expect(200);

    expect(response.body).toHaveProperty('orderId');
    expect(response.body.status).toBe('pending');
  });

  test('POST /api/orders/execute - should validate input', async () => {
    await request(app.server)
      .post('/api/orders/execute')
      .send({
        tokenIn: '',
        tokenOut: 'USDC',
        amount: 0
      })
      .expect(400);
  });

  test('GET /health - should return OK', async () => {
    const response = await request(app.server)
      .get('/health')
      .expect(200);

    expect(response.body.status).toBe('OK');
  });

  test('POST /api/orders/execute - should reject negative amount', async () => {
    await request(app.server)
      .post('/api/orders/execute')
      .send({
        tokenIn: 'SOL',
        tokenOut: 'USDC',
        amount: -1
      })
      .expect(400);
  });

  test('GET /api/orders/:orderId - should return 404 for non-existent order', async () => {
    await request(app.server)
      .get('/api/orders/non-existent-order-id')
      .expect(404);
  });

  test('POST /api/orders/execute - should process concurrent orders', async () => {
    // Submit 2 orders quickly to test concurrency
    const order1 = request(app.server)
      .post('/api/orders/execute')
      .send({ tokenIn: 'SOL', tokenOut: 'USDC', amount: 1.0 });

    const order2 = request(app.server)
      .post('/api/orders/execute') 
      .send({ tokenIn: 'ETH', tokenOut: 'USDC', amount: 0.5 });

    const [response1, response2] = await Promise.all([order1, order2]);

    expect(response1.body).toHaveProperty('orderId');
    expect(response2.body).toHaveProperty('orderId');
    expect(response1.body.status).toBe('pending');
    expect(response2.body.status).toBe('pending');
  });
});
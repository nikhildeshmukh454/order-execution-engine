const { MockDexRouter } = require('../src/services/dexRouter');

describe('MockDexRouter', () => {
  let dexRouter: any;

  beforeEach(() => {
    dexRouter = new MockDexRouter();
  });

  test('should get quotes from both DEXs', async () => {
    const raydiumQuote = await dexRouter.getRaydiumQuote('SOL', 'USDC', 1);
    const meteoraQuote = await dexRouter.getMeteoraQuote('SOL', 'USDC', 1);

    expect(raydiumQuote).toHaveProperty('price');
    expect(raydiumQuote.dex).toBe('raydium');
    expect(meteoraQuote).toHaveProperty('price');
    expect(meteoraQuote.dex).toBe('meteora');
  });

  test('should return best quote', async () => {
    const bestQuote = await dexRouter.getBestQuote('SOL', 'USDC', 1);
    expect(bestQuote).toHaveProperty('price');
    expect(bestQuote).toHaveProperty('fee');
  });

  test('DEX router should be properly instantiated', () => {
    expect(dexRouter).toBeDefined();
    expect(dexRouter).toHaveProperty('getRaydiumQuote');
    expect(dexRouter).toHaveProperty('getMeteoraQuote');
  });
});
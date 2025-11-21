import { DexQuote, SwapResult } from '../types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockDexRouter {
  private basePrices: { [key: string]: number } = {
    'SOL/USDC': 100,
    'ETH/USDC': 2000,
    'BTC/USDC': 30000
  };

  async getRaydiumQuote(tokenIn: string, tokenOut: string, amount: number): Promise<DexQuote> {
    await sleep(200 + Math.random() * 100);
    
    const pair = `${tokenIn}/${tokenOut}`;
    const basePrice = this.basePrices[pair] || 50;
    const price = basePrice * (0.98 + Math.random() * 0.04);
    
    return { price, fee: 0.003, dex: 'raydium' };
  }

  async getMeteoraQuote(tokenIn: string, tokenOut: string, amount: number): Promise<DexQuote> {
    await sleep(200 + Math.random() * 100);
    
    const pair = `${tokenIn}/${tokenOut}`;
    const basePrice = this.basePrices[pair] || 50;
    const price = basePrice * (0.97 + Math.random() * 0.05);
    
    return { price, fee: 0.002, dex: 'meteora' };
  }

  async getBestQuote(tokenIn: string, tokenOut: string, amount: number): Promise<DexQuote> {
    const [raydiumQuote, meteoraQuote] = await Promise.all([
      this.getRaydiumQuote(tokenIn, tokenOut, amount),
      this.getMeteoraQuote(tokenIn, tokenOut, amount)
    ]);

    // Calculate effective price after fees
    const raydiumEffectivePrice = raydiumQuote.price * (1 - raydiumQuote.fee);
    const meteoraEffectivePrice = meteoraQuote.price * (1 - meteoraQuote.fee);

    console.log(`DEX Comparison: Raydium $${raydiumEffectivePrice.toFixed(4)} vs Meteora $${meteoraEffectivePrice.toFixed(4)}`);

    return raydiumEffectivePrice > meteoraEffectivePrice ? raydiumQuote : meteoraQuote;
  }

  async executeSwap(dex: 'raydium' | 'meteora', tokenIn: string, tokenOut: string, amount: number): Promise<SwapResult> {
    await sleep(2000 + Math.random() * 1000);
    
    const pair = `${tokenIn}/${tokenOut}`;
    const basePrice = this.basePrices[pair] || 50;
    const executedPrice = basePrice * (0.98 + Math.random() * 0.04);
    
    // Generate mock transaction hash
    const txHash = `0x${Array.from({length: 64}, () => 
      Math.floor(Math.random() * 16).toString(16)).join('')}`;
    
    console.log(`Swap executed on ${dex}: ${amount} ${tokenIn} -> ${tokenOut} at $${executedPrice}`);
    
    return { txHash, executedPrice };
  }
}
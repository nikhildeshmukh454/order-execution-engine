export interface Order {
  id: string;
  type: 'market';
  tokenIn: string;
  tokenOut: string;
  amount: number;
  status: OrderStatus;
  dexUsed?: 'raydium' | 'meteora';
  executedPrice?: number;
  txHash?: string;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 
  | 'pending' 
  | 'routing' 
  | 'building' 
  | 'submitted' 
  | 'confirmed' 
  | 'failed';

export interface DexQuote {
  price: number;
  fee: number;
  dex: 'raydium' | 'meteora';
}

export interface SwapResult {
  txHash: string;
  executedPrice: number;
}
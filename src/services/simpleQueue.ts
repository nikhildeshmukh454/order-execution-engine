import { Order } from '../types';
import { MockDexRouter } from './dexRouter';
import { DatabaseService } from './database';
import { WebSocketService } from './websocket';

export class SimpleQueue {
  private isProcessing = false;
  private queue: Order[] = [];
  private concurrency = 10;
  private processingCount = 0;

  private databaseService = new DatabaseService();
  private dexRouter = new MockDexRouter();
  private wsService = new WebSocketService();

  async add(order: Order): Promise<void> {
    this.queue.push(order);
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.processingCount >= this.concurrency) return;
    
    this.isProcessing = true;
    
    while (this.queue.length > 0 && this.processingCount < this.concurrency) {
      const order = this.queue.shift();
      if (order) {
        this.processingCount++;
        this.processOrder(order).finally(() => {
          this.processingCount--;
          this.processQueue();
        });
      }
    }
    
    this.isProcessing = false;
  }

  private async processOrder(order: Order): Promise<void> {
    try {
      // Update status: routing
      await this.databaseService.updateOrderStatus(order.id, 'routing');
      await this.wsService.sendStatus(order.id, 'routing', 'Comparing DEX prices...');
      
      // Get best quote
      const bestQuote = await this.dexRouter.getBestQuote(order.tokenIn, order.tokenOut, order.amount);
      
      // Update status: building
      await this.databaseService.updateOrderStatus(order.id, 'building', { dexUsed: bestQuote.dex });
      await this.wsService.sendStatus(order.id, 'building', `Building transaction for ${bestQuote.dex}...`);
      
      // Execute swap
      const swapResult = await this.dexRouter.executeSwap(
        bestQuote.dex, 
        order.tokenIn, 
        order.tokenOut, 
        order.amount
      );
      
      // Update status: submitted
      await this.databaseService.updateOrderStatus(order.id, 'submitted', {
        dexUsed: bestQuote.dex,
        txHash: swapResult.txHash
      });
      await this.wsService.sendStatus(order.id, 'submitted', 'Transaction submitted to network');
      
      // Simulate confirmation delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update status: confirmed
      await this.databaseService.updateOrderStatus(order.id, 'confirmed', {
        dexUsed: bestQuote.dex,
        executedPrice: swapResult.executedPrice,
        txHash: swapResult.txHash
      });
      await this.wsService.sendStatus(order.id, 'confirmed', 
        `Order executed at $${swapResult.executedPrice} on ${bestQuote.dex}`, 
        { txHash: swapResult.txHash, executedPrice: swapResult.executedPrice }
      );
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      
      await this.databaseService.updateOrderStatus(order.id, 'failed', { error: errorMsg });
      await this.wsService.sendStatus(order.id, 'failed', errorMsg);
      
      console.error(`Order ${order.id} failed:`, errorMsg);
    }
  }
}

export const simpleQueue = new SimpleQueue();
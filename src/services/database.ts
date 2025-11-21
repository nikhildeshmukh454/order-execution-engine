import sqlite3 from 'sqlite3';
import { Order } from '../types';

export class DatabaseService {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database('./orders.db');
    this.initDatabase();
  }

  private initDatabase(): void {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        token_in TEXT NOT NULL,
        token_out TEXT NOT NULL,
        amount REAL NOT NULL,
        status TEXT NOT NULL,
        dex_used TEXT,
        executed_price REAL,
        tx_hash TEXT,
        error_message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async createOrder(order: Omit<Order, 'createdAt' | 'updatedAt'>): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(`
        INSERT INTO orders (id, type, token_in, token_out, amount, status, dex_used, executed_price, tx_hash, error_message)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        order.id, order.type, order.tokenIn, order.tokenOut, order.amount,
        order.status, order.dexUsed, order.executedPrice, order.txHash, order.error
      ], function(err) {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async updateOrderStatus(orderId: string, status: string, updates: Partial<Order> = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log(`📝 UPDATING ORDER ${orderId} TO: ${status}`); // ADD THIS LINE
      
      this.db.run(`
        UPDATE orders 
        SET status = ?, dex_used = ?, executed_price = ?, tx_hash = ?, error_message = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [
        status, updates.dexUsed, updates.executedPrice, updates.txHash, updates.error, orderId
      ], function(err) {
        if (err) {
          console.error('❌ DB UPDATE ERROR:', err); // ADD THIS LINE
          reject(err);
        } else {
          console.log(`✅ ORDER ${orderId} UPDATED TO: ${status}`); // ADD THIS LINE
          resolve();
        }
      });
    });
  }

  async getOrder(orderId: string): Promise<Order | null> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM orders WHERE id = ?', [orderId], (err, row: any) => {
        if (err) reject(err);
        else if (!row) resolve(null);
        else {
          resolve({
            id: row.id,
            type: row.type,
            tokenIn: row.token_in,
            tokenOut: row.token_out,
            amount: parseFloat(row.amount),
            status: row.status,
            dexUsed: row.dex_used,
            executedPrice: row.executed_price ? parseFloat(row.executed_price) : undefined,
            txHash: row.tx_hash,
            error: row.error_message,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at)
          });
        }
      });
    });
  }
}
export class WebSocketService {
  private clients: Map<string, any> = new Map();

  addClient(orderId: string, connection: any) {
    this.clients.set(orderId, connection);
    
    connection.socket.on('close', () => {
      this.clients.delete(orderId);
    });
  }

  async sendStatus(orderId: string, status: string, message: string, data?: any) {
    const connection = this.clients.get(orderId);
    
    if (connection) {
      connection.send(JSON.stringify({
        orderId,
        status,
        message,
        timestamp: new Date().toISOString(),
        ...data
      }));
    }
  }

  removeClient(orderId: string) {
    this.clients.delete(orderId);
  }
}
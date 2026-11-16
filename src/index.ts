import http from 'node:http';
import { CustomerOrderService } from './service/CustomerOrderService.js';

export * from './domain/types.js';
export * from './service/CustomerOrderService.js';

const customer = new CustomerOrderService();
const PORT = Number(process.env.PORT) || 3013;

export const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200);
    return res.end(JSON.stringify({ status: 'UP', service: 'oengo-customer', timestamp: new Date().toISOString() }));
  }

  if (req.url?.startsWith('/api/customer/order') && req.method === 'GET') {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const orderId = url.searchParams.get('id') || '';
    const order = customer.getOrder(orderId);
    if (!order) {
      res.writeHead(404);
      return res.end(JSON.stringify({ success: false, error: 'Order not found' }));
    }
    res.writeHead(200);
    return res.end(JSON.stringify({ success: true, data: order }));
  }

  res.writeHead(404);
  return res.end(JSON.stringify({ success: false, error: 'Endpoint Not Found' }));
});

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[oengo-customer] Customer Order Management Microservice listening on port ${PORT}`);
  });
}

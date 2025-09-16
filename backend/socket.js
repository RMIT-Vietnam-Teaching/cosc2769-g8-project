import { Server as SocketIOServer } from 'socket.io';

/**
 * Initialize Socket.IO server for shopping cart events.
 * @param {import('http').Server} server
 */
export function initSocket(server) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH'],
    },
    path: '/ws',
  });

  io.on('connection', (socket) => {
    const userId = socket.handshake.auth?.userId || socket.id;
    socket.join(`user:${userId}`);

    socket.emit('cart:hello', { message: 'Connected to cart socket', userId });

    // Basic cart events
    socket.on('cart:add', (item) => {
      io.to(`user:${userId}`).emit('cart:updated', { type: 'add', item });
    });

    socket.on('cart:remove', (itemId) => {
      io.to(`user:${userId}`).emit('cart:updated', { type: 'remove', itemId });
    });

    socket.on('cart:update', (payload) => {
      io.to(`user:${userId}`).emit('cart:updated', { type: 'update', ...payload });
    });

    socket.on('disconnect', () => {
    });
  });

  return io;
}

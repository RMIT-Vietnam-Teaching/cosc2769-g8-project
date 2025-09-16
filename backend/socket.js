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
    const roomId = socket.handshake.auth?.roomId || socket.id;
    const room = `cart:${roomId}`;
    socket.join(room);

    socket.emit('cart:hello', { message: 'Connected to cart socket', roomId });

    // Basic cart events
    socket.on('cart:add', (item) => {
      socket.to(room).emit('cart:updated', { type: 'add', item });
    });

    socket.on('cart:remove', (itemId) => {
      socket.to(room).emit('cart:updated', { type: 'remove', itemId });
    });

    socket.on('cart:update', (payload) => {
      socket.to(room).emit('cart:updated', { type: 'update', ...payload });
    });

    socket.on('cart:clear', () => {
      socket.to(room).emit('cart:updated', { type: 'clear' });
    });

    socket.on('disconnect', () => {
    });
  });

  return io;
}

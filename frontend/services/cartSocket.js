import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';
const SOCKET_PATH = '/ws';

class CartSocket {
    constructor() {
        this.socket = null;
  }

    connect(auth = {}) {
        if (this.socket?.connected) return this.socket;
        this.socket = io(SOCKET_URL, {
            path: SOCKET_PATH,
            transports: ['websocket'],
            autoConnect: true,
            auth,
        });
        return this.socket;
  }

    disconnect() {
        this.socket?.disconnect();
  }

    on(event, handler) {
        this.socket?.on(event, handler);
  }

    off(event, handler) {
        this.socket?.off(event, handler);
  }

    add(item) {
        this.socket?.emit('cart:add', item);
  }

    remove(itemId) {
        this.socket?.emit('cart:remove', itemId);
  }

    update(payload) {
        this.socket?.emit('cart:update', payload);
  }
}

const cartSocket = new CartSocket();
export default cartSocket;

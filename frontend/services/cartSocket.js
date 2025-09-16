/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Đoàn Đắc Nguyên
# ID: s4131473
*/
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';
const SOCKET_PATH = '/ws';

class CartSocket {
	constructor() {
		this.socket = null;
	}

	getOrCreateRoomId() {
		let id = localStorage.getItem('cartRoomId');
		if (!id) {
			id = Math.random().toString(36).slice(2) + Date.now().toString(36);
			localStorage.setItem('cartRoomId', id);
		}
		return id;
	}

	connect() {
		if (this.socket?.connected) return this.socket;
		const auth = { roomId: this.getOrCreateRoomId() };
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

	clear() {
		this.socket?.emit('cart:clear');
	}
}

const cartSocket = new CartSocket();
export default cartSocket;

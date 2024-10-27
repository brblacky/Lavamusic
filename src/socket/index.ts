import { Server } from 'socket.io';
import type Lavamusic from '@/structures/Lavamusic';
import type http from 'node:http';
import guildHandler from './handlers/generalHandlers';

export default class SocketServer {
	private readonly client: Lavamusic;
	public io!: Server;

	constructor(client: Lavamusic) {
		this.client = client;
	}

	private setupSocketServer(server: http.Server) {
		this.io = new Server(server, {
			cors: {
				origin: '*'
			}
		});
		this.setupSocketEvents();
	}

	private setupSocketEvents() {
		this.io.on('connection', (socket) => {
			guildHandler(socket, this.client);
		});
	}

	public start() {
		this.setupSocketServer(this.client.api.getServer);
		this.client.logger.info(`[Socket] Server is running on port: ${this.client.api.getPort}`);
	}
}

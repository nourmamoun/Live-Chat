from websocket_server import Server, WebSocket

clients = []

class ChatWebSocket(WebSocket):
    def handle_connected(self):
        clients.append(self)
        self.broadcast_online_clients()
        print(f"Client connected: {self.address}")
        print(f"Online clients: {len(clients)}")

    def handle_message(self):
        print(f"Received: {self.data}")  
        for client in clients:
            if client != self:
                client.send_message(self.data)
                

    def handle_close(self):
        print(f"Client disconnected: {self.address}")
        if self in clients:
            clients.remove(self)
        self.broadcast_online_clients()
            
    def broadcast_online_clients(self):
        online_count_message = f"Online clients: {len(clients)}"
        for client in clients:
            client.send_message(online_count_message)

if __name__ == "__main__":
    print("Starting chat server on ws://localhost:12345")
    server = Server("localhost", 12345, ChatWebSocket)
    server.serveforever()

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('Новое подключение:', socket.id);

    socket.on('join-chat', (chatId) => {
        socket.join(chatId);
        console.log(`Пользователь ${socket.id} присоединился к чату ${chatId}`);
    });

    socket.on('send-message', (data) => {
        if (data.chatId && data.message) {
            io.to(data.chatId).emit('new-message', data);
            console.log(`Сообщение в чат ${data.chatId}: ${data.message}`);
        }
    });

    socket.on('disconnect', () => {
        console.log('Пользователь отключился:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`WebSocket - сервер запущен в порту ${PORT}`);
});


const express = require('express');
const cors = require('cors');
const http = require('http');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
io.once('connection', (socket) => {
    app.set('io', socket); //attach io to app
    console.log('set');
});

app.post('/api/chats', (req, res) => {
    // app.get('io').emit('chat', { chat: req.body.text });
    console.log(req.path);
    res.json(req.body);
});

server.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
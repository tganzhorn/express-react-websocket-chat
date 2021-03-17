const express = require('express');
const app = express();
const server = require('http').createServer(app);

const port = process.env.PORT || 5000;

const io = require('socket.io')(server, {
  cors: {
    origin: false,
    methods: ["GET", "POST"]
  }
});

app.use(express.static('client/build'));

io.on('connection', socket => {
  console.log("A user connected via " + socket.client.conn.transport.constructor.name + "!");
  socket.on('disconnect', () => {
    console.log('A user disconnected!');
  });

  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  })
});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send({
    message: `Hello World!`,
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const socketIO = require('socket.io');

dotenv.config({ path: './config.env' });
const app = require('./app');

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App is runing on ${port}`);
});

const DB = process.env.DB_STRING.replace('<PASSWORD>', process.env.DB_PASS);
mongoose.connect(DB).then(() => {
  console.log('Data Base connection successfull');
});

const io = socketIO(server, {
  pingTimeout: 6000,
  cors: {
    origin: 'http://localhost:5173',
  },
});

io.on('connection', (socket) => {
  // console.log('Socket Connected');
  socket.on('setup', (userData) => {
    // console.log(userData);
    socket.join(userData._id);
    socket.emit('connected');
  });

  socket.on('join room', (room) => {
    // console.log(room);
    socket.join(room);
  });

  socket.on('new message', (newMessage) => {
    newMessage?.chat?.users?.forEach((element) => {
      // console.log(element);
      // console.log(newMessage?.chat?.sender);
      // if (element?._id == newMessage?.chat?.sender) return;
      socket.in(element._id).emit('recived', newMessage);
    });
  });
});

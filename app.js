const express = require('express');
const mongoose = require('mongoose');

const checkAuth = require('./middleware/check-auth');

const userRoutes = require('./routes/user.routes');
const notesRoutes = require('./routes/notes.routes');

// DB connection
mongoose.connect('mongodb://localhost:27017/notedowntest', { useNewUrlParser: true });
const db = mongoose.connection;
db.once('open', () => console.log('Connected to MongoDb'));
// db.on('error', console.error.bind(console, 'Connection error!'));


const app = express();

// Cors allow middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') res.send(200);
  else next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/user', userRoutes);
app.use('/api/notes', checkAuth, notesRoutes); // need authorization to create a note

module.exports = app;
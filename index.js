const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

let usersArray = [];

app.post('/api/users', (req, res) => {
  const { username } = req.body;
  const newUser = { username, _id: usersArray.length.toString() };
  usersArray.push(newUser);
  res.json(newUser);
})

app.get('/api/users', (req, res) => {
  res.json(usersArray);
})

let exercicesArray = [];

app.post('/api/users/:_id/exercises', (req, res) => {
  const { description, duration, date } = req.body;
  const userId = parseInt(req.params._id);
  const exerciceDate = date ? new Date(date) : new Date();
  const { username, _id } = usersArray[userId];
  const exercise = { description, duration: parseInt(duration), date: exerciceDate.toDateString() }
  exercicesArray.push({ username, _id, ...exercise })
  res.json({ username, _id, ...exercise });
})

app.get('/api/users/:_id/logs', (req, res) => {
  const userId = req.params._id;
  const { from, to, limit } = req.query;
  const user = usersArray[parseInt(userId)];
  if(!user) {
    return res.json({ error: "User not found" })
  }
  let log = exercicesArray.filter(exercise => exercise._id == userId);
  const count = log.length;
  if(from) log = log.filter(exercise => new Date(exercise.date) >= new Date(from));
  if(to) log = log.filter(exercise => new Date(exercise.date) <= new Date(to));
  if(limit) log.length = parseInt(limit);
  res.json({ ...user, count, log });
})

app.get('/')

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

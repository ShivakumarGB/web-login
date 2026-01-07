const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: 'demo_secret_key',
    resave: false,
    saveUninitialized: false,
  })
);

// Demo user (password: 123456)
const users = [
  {
    id: 1,
    username: 'admin',
    passwordHash: bcrypt.hashSync('123456', 10),
  },
];

// Auth middleware
function requireLogin(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).send('Please login first');
  }
}

// Routes
app.get('/', (req, res) => {
  res.send(`
    <h2>Node.js Login Demo</h2>
    <form method="POST" action="/login">
      <input name="username" placeholder="username" /><br/>
      <input name="password" type="password" placeholder="password" /><br/>
      <button type="submit">Login</button>
    </form>
  `);
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.send('User not found');
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.send('Wrong password');
  }

  req.session.user = {
    id: user.id,
    username: user.username,
  };

  res.redirect('/dashboard');
});

app.get('/dashboard', requireLogin, (req, res) => {
  res.send(`
    <h2>Welcome ${req.session.user.username}</h2>
    <a href="/logout">Logout</a>
  `);
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

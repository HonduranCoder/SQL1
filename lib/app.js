const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

//Get one 
app.get('/halloween-characters/:id', async(req, res) => {
  try {
    const data = await client.query('SELECT * from halloween_characters where id=$1', [req.params.id]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

//Get all
app.get('/halloween-characters', async(req, res) => {
  try {
    const data = await client.query('SELECT * from halloween_characters');
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

//Create one
app.post('/halloween-characters', async(req, res) => {
  try {
    const data = await client.query(`
      INSERT INTO halloween_characters (name, movie, category, image, owner_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [req.body.name, req.body.movie, req.body.category, req.body.image, 1]);

    res.json(data.rows[0]);
  } catch(e) {

    res.status(500).json({ error: e.message });
  }
});

//Update one 
app.put('/halloween-characters/:id', async(req, res) => {
  try {
    const data = await client.query(`
      UPDATE halloween_characters
      SET name = $1, movie = $2, category = $3, image = $4
      WHERE id = $5
      RETURNING *
        `, [req.body.name, req.body.movie, req.body.category, req.body.image, req.params.id]);

    res.json(data.rows[0]);
  } catch(e) {

    res.status(500).json({ error: e.message });
  }
});


//Delete one 
app.delete('/halloween-characters/:id', async(req, res) => {
  try {
    const data = await client.query('DELETE from halloween_characters where id=$1 RETURNING *', [req.params.id]);

    res.json(data.rows[0]);
  } catch(e) {

    res.status(500).json({ error: e.message });
  }
});


app.use(require('./middleware/error'));

module.exports = app;

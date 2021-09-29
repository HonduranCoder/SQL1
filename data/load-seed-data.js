const client = require('../lib/client');
// import our seed data:
const halloweenCharacters = require('./halloween.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      halloweenCharacters.map(halloween => {
        return client.query(`
                    INSERT INTO halloween_characters (name, movie, category, image, owner_id)
                    VALUES ($1, $2, $3, $4, $5);
                `,
        [halloween.name, halloween.movie, halloween.category, halloween.image, user.id]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}

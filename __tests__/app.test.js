require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });

    test('halloween-characters', async() => {

      const expectation = [
        {
          id:1,
          name: 'Michael Myers', 
          movie: 'Halloween', 
          category: 'Dangerous Men',
          image: 'https://m.media-amazon.com/images/I/41cnyG7PO5L._AC_SS450_.jpg', 
          owner_id:1
        }, 
        {
          id:2,
          name:'Chuckie', 
          movie: 'Child\'s Play', 
          category: 'Nightmare Fuel',
          image: 'https://alternativemovieposters.com/wp-content/uploads/2019/06/pullin_childsplay.jpg', 
          owner_id:1
        }, 
        {
          id:3,
          name: 'Pennywise', 
          movie: 'IT', 
          category: 'Deepest Fears',
          image:'https://m.media-amazon.com/images/I/71b9C02hskL._AC_SY679_.jpg',
          owner_id:1
        }, 
        {
          id:4,
          name:'Hannibal Lecter', 
          movie: 'The Silence of the Lambs',
          category: 'Dangerous Men',
          image:'https://m.media-amazon.com/images/I/81SVDO6WcrL._AC_SY679_.jpg',
          owner_id:1

        }
      ]; 

      const data = await fakeRequest(app)
        .get('/halloween-characters')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
    test('halloween-characters', async() => {

      const expectation = 
      {
        id:1,
        name: 'Michael Myers', 
        movie: 'Halloween', 
        category: 'Dangerous Men',
        image: 'https://m.media-amazon.com/images/I/41cnyG7PO5L._AC_SS450_.jpg', 
        owner_id:1
      };
  
      const data = await fakeRequest(app)
        .get('/halloween-characters/1')
        .expect('Content-Type', /json/);
      // .expect(200);
  
      expect(data.body).toEqual(expectation);
    });
  });
});

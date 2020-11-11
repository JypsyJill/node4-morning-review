require('dotenv').config();

const express = require('express');
const massive = require('massive');
const session = require('express-session');

const {CONNECTION_STRING, SERVER_PORT, SESSION_SECRET} = process.env;
const auth = require('./controllers/authController');
const middleware = require('./middleware/middleware');

const app = express();

app.use(express.json());
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}))

app.use(express.json());

massive({ 
    connectionString: CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
}).then( db => {
    app.set('db', db)
    console.log("connected to DB")

})
app.post('/auth/register', middleware.checkUsername, auth.register)
app.post('/auth/login', middlware.checkEmail, auth.login);
app.post('/auth/logout', auth.logout);
app.get('/api/user', auth.getUser);

app.listen(SERVER_PORT, () => console.log(`listening on port ${SERVER_PORT}`));
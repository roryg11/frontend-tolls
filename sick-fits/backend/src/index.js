// Startup node server
require('dotenv').config({path: "variables.env"});
const createServer = require('./createServer');
const cookieParser = require("cookie-parser");
const db = require('./db');
const server = createServer();

// TODO use express middleware to handle cookies(JWT)
server.express.use(cookieParser());
// TODO populate current user

server.start({
    cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL
    }
}, deets => {
    console.log(`Server is now running on http://localhost:${deets.port}`);
})
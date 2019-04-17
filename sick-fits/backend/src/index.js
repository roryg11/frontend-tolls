// Startup node server
require('dotenv').config({path: "variables.env"});
const createServer = require('./createServer');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken"); 
const db = require('./db');
const server = createServer();

server.express.use(cookieParser());

server.express.use((req, res, next)=>{
    // get the toke from the req cookies
    const { token } = req.cookies;
    // decode it slash verify with jwt
    if(token){
        const {userId} = jwt.verify(token, process.env.APP_SECRET);
        req.userId = userId; 
    }
    // allows the request to continue
    next();
});

server.express.use(async (req, res, next)=>{
    if(!req.userId){
        return next();
    }

    const user = await db.query.user({where: {id: req.userId}}, `{id, name, email, permissions}`);

    req.user = user;
    next();
});

server.start({
    cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL
    }
}, deets => {
    console.log(`Server is now running on http://localhost:${deets.port}`);
})
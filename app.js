const dotenv = require("dotenv");
const mongoose = require('mongoose');
const express = require('express');
const app = express();
dotenv.config({path:'./config.env'});
require('./db/conn');
// const User = require('./modal/userSchema');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.json());

// we link the router files
app.use(require('./router/auth'));

const PORT = process.env.PORT;


// app.get('/about', (req, res)=>{
//     res.send("About me from the server");
// });


app.listen(PORT, ()=>{
    console.log(`server is running at port no ${PORT}`);
})


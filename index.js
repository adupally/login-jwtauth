
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const jwt = require('jsonwebtoken')
const {requireAuth, checkUser} = require('./middlewares/authMiddlewares')


const cookieParser = require('cookie-parser')

const authRoutes = require('./routes/authRoutes')

const mongoose = require('mongoose')

const app = express()
app.use(cors());
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

// app.use(authRoutes)

app.set('view engine','ejs')


const dbURI = process.env.MONGO_URI;
// console.log(dbURI)

mongoose.connect(dbURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(() => app.listen(process.env.PORT))
.catch((err) =>console.log(err));

app.get('*', checkUser);
// console.log(process.env.PORT)
app.get("/",(req,res)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,"secret",(err,decodedToken) => {
          if(err) {   
           res.render("login");
          }else{
            res.render("dashboard");
          }
        });
    } else{
    res.render("login");
    }
});

app.get('/dashboard',requireAuth,(req,res) => {
    res.render('dashboard')
});
app.use(authRoutes);




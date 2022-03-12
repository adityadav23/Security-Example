const path = require('path')
const https = require('https')
const fs = require('fs')
const helmet  = require('helmet')
const passport = require('passport')
const cookieSession = require('cookie-session')
const {Strategy} = require('passport-google-oauth20')
require('dotenv').config()


const express = require('express')

const PORT = 3000

const config = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    COOKIE_KEY_1: process.env.COOKIE_KEY_1,
    COOKIE_KEY_2: process.env.COOKIE_KEY_2,
}

const AUTH_OPTIONS = {
    callbackURL: '/auth/google/callback',
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
}

function verifyCallback(accessToken, refreshToken,profile, done){
    console.log('Google profile: ', profile)
    done(null, profile)
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback))

passport.serializeUser((user,done)=>{
    done(null,user.id)
})

passport.deserializeUser((id,done)=>{
    done(null,id)
})


const app = express()

app.use(helmet())
app.use(cookieSession({
    name:'session',
    maxAge:1000*60*60*24,
    keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],
}))

app.use(passport.initialize())
app.use(passport.session())

function isLogggedIn(req, res, next){
    console.log('Current user is: ', req.user)
    const isLoggedIn = req.isAuthenticated() && req.user

    if(!isLoggedIn){
        res.status(401).json({
            error:'You must log in!'
        })
    }
    next()
}

app.get('/auth/google', passport.authenticate('google',{
    scope:['email'],
}))

app.get('/auth/google/callback',passport.authenticate('google',{
    failureRedirect: '/failure',
    successRedirect: '/',
    session: true,
    })
    ,(req,res)=>{
    console.log('Google called us back!')
})
app.get('/auth/logout',(req,res)=>{})



app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'))

})

app.get('/secret',isLogggedIn,(req,res)=>{

    res.send('Your secret value is 422!')
})

app.get('/failure', (req,res)=>{
    return res.send('Failed to login!')
})


https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
},app).listen(PORT,()=>{
    console.log(`Server is listening on port: ${PORT}`)
})
const path = require('path')
const https = require('https')
const fs = require('fs')
const helmet  = require('helmet')

const express = require('express')

const PORT = 3000
const app = express()

app.use(helmet())

function isLogggedIn(req, res, next){
    const isLoggedIn = true //TODO
    if(!isLoggedIn){
        res.status(401).json({
            error:'You must log in!'
        })
    }

    next()

}

app.get('/auth/google',(req,res)=>{})

app.get('/auth/google/callback',(req,res)=>{})
app.get('/auth/logout',(req,res)=>{})



app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'))

})

app.get('/secret',isLogggedIn,(req,res)=>{

    res.send('Your secret value is 422!')
})

https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
},app).listen(PORT,()=>{
    console.log(`Server is listening on port: ${PORT}`)
})
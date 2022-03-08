const path = require('path')
const http = require('http')
const fs = require('fs')

const express = require('express')
const app = express()

const PORT = 3000

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'))

})

app.get('/secret',(req,res)=>{

    res.send('Your secret value is 422!')
})

http.createServer(app).listen(PORT,()=>{
    console.log(`Server is listenong on port: ${PORT}`)
})
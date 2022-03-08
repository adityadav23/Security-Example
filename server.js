const path = require('path')
const https = require('https')
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

https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
},app).listen(PORT,()=>{
    console.log(`Server is listening on port: ${PORT}`)
})
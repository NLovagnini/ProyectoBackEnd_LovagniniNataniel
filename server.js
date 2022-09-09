const express = require('express')
const app = express()
const productRoutes = require('./routes/products.js')
const path = require('path')

const {Server: SocketServer} = require('socket.io')
const {Server: HTTPServer} = require('http')


const httpServer = new HTTPServer(app)
const socketServer = new SocketServer(httpServer)

const Container = require('./class.js')
const prodContainer = new Container('./products.json')


app.use(express.static("public"))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/productos', productRoutes)




socketServer.on('connection', (socket) =>{
    console.log('New Client');
    socket.emit('allProds', prodContainer.getAllProds());

    socket.on('newProd', (newObj) =>{
        prodContainer.save(newObj)
        socketServer.sockets.emit('allprods', prodContainer.getAllProds())
    })
})

app.get('/', (req, res) =>{
    res.sendFile(__dirname+'/public/index.html')
})

const PORT = 8000
httpServer.listen(PORT, ()=> {
    console.log(`SERVER ONLINE ON PORT ${PORT}`)
})


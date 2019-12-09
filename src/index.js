const express=require('express')
const app=express()
const http=require('http')
const path=require('path')
const socketio=require('socket.io')
const server=http.createServer(app)
const io=socketio(server)

const {generateMessage,generateLocationMessage}=require('./utils/messages')

const {addUser,removeUser,getUser,getUsersInRoom}=require('./utils/users')



const publicDirectoryPath=path.join(__dirname,'../public')
const port=process.env.PORT||3000

app.use(express.static(publicDirectoryPath))

io.on('connection',(socket)=>{
    console.log('New web socket connection')
    

    socket.on('join',({username,room},callback)=>{
        const {error,user}=addUser({id:socket.id,username,room})
        if(error){
            return callback(error)
        }

        socket.join(room)
        socket.emit('message',generateMessage('Welcome',{username:'ChatBot'}))
        socket.broadcast.to(room).emit('message',generateMessage(`${username} has joined the room!`,{username:'ChatBot'}))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })

        callback()

    })

    socket.on('sendMessage',(message)=>{
        const user=getUser(socket.id)
        if(user){
            io.to(user.room).emit('message',generateMessage(message,user))
        }


        
    })

    socket.on('sendLocation',(coords)=>{
        const user=getUser(socket.id)
        if(user)

        io.emit('sendLocationMessage',generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`,user))
    })

    socket.on('disconnect',()=>{
        const user=removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message',generateMessage(`${user.username} left the room!`,{username:'ChatBot'}))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }

        
    })

})

server.listen(port,()=>{ 
    console.log('The server is up and running')

})


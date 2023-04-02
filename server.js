const path=require('path');
const http=require('http');

const express=require('express');
const socketio=require('socket.io');
const formatMessage=require('./utils/messages');
const {userJoin, getCureentUser,userLeave,getRoomUsers}=require('./utils/user');
const app=express();
const server=http.createServer(app);
const io=socketio(server)
//set static folder
app.use(express.static(path.join(__dirname,'public')));
const botname='ChatwithUs App Bot';
//run when a client connect
io.on('connection',socket =>
{
    socket.on('joinRoom',({username,room}) => {
        const user=userJoin(socket.id,username,room)
        socket.join(user.room)

        socket.emit('message',formatMessage(botname,'Welcome to HUB'));
        //show whwn a user connect
        socket.broadcast.to(user.room).emit('message',
        formatMessage(botname,`${user.username} has joined the chat`));//all the client expect user
        //runs when the user discconect
        //send users and room info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        });
    });
//emit a message


//listen for chat message
socket.on('chatMessage', msg =>{
    const user=getCureentUser(socket.id);
   io.to(user.room).emit('message',formatMessage(user.username,msg));
});
socket.on('disconnect',() =>
{
    const user=userLeave(socket.id);
    if(user)
    {
        io.to(user.room).emit('message',formatMessage(botname,` ${user.username} has left`));
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        });
    }
   
});
// io.emit()//to everyone
});


const port=3000 || process.env.port;
server.listen(port,() => console.log('server is runing on port 3000'));

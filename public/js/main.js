const chatForm=document.getElementById('chat-form');
const chatMessages=document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name');
const userList=document.getElementById('users');
//get user name and room from url
const{username,room}=Qs.parse(location.search,{
   ignoreQueryPrefix:true 
});

const socket=io();
//joi n chat room
socket.emit('joinRoom',{username , room});
//get room and users
socket.on('roomUsers',({users,room})=>{
    outputRoomName(room);
    outputUsers(users);
})

//message from server
socket.on('message',message=>{
    console.log(message);
    outputMessage(message);

//scrool down
chatMessages.scrollTop=chatMessages.scrollHeight
});


//message  submit 
chatForm.addEventListener('submit', (e) => {

    e.preventDefault();

//get message text
const msg=e.target.elements.msg.value;
//emit a mssg to server
socket.emit('chatMessage',msg);
//claer message
e.target.elements.msg.value='';
e.target.elements.msg.focus();


});
 
function outputMessage(message)
{
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p>				
    <p class="text">
    ${message.text}
</p>`
    document.querySelector('.chat-messages').appendChild(div)

}
//add room name to dom 
function outputRoomName(room)
{
roomName.innerText=room;

}
//add users to Dom
function outputUsers(users)
{
   userList.innerHTML=`
   ${users.map(user=> `<li>${user.username} </li>`).join()}
   `;
}
//CLIENT SIDE
//CLIENT CODE

console.log("Client");
const socket = io();

//DOM ELEMENTS SELECCIONE LOS ELEMENTOS DEL HTML
let message = document.getElementById('message');
let username = document.getElementById('username');
let btn = document.getElementById('send');
let output = document.getElementById('output');
let actions = document.getElementById('actions');
let upload = document.getElementById('uploadImage');
let uploadFile = document.getElementById('uploadFile');

//////MANDAR INFORMACIÓN AL SERVIDOR///////////////////////////////////////////////////

//Para mandar mensjae al server al pulsar el boton send
btn.addEventListener('click', function(){
    //Para mandar los datos al servidor usamos la variable socket que vendría siendo el socket conectado con el server
    //.emit() Requiere 2 parametros, 1. Nombre, 2. Datos
    socket.emit('Chat:Message',{
    message : message.value,
    username : username.value
  });
})

//Para mostrar que un usuario esta escribiendo desde la ("PC")
message.addEventListener('keypress', ()=>{
  socket.emit('chat:typing', {username: username.value});
})

//Para mostrar que un usuario esta escribiendo desde de ("Mobile")
message.addEventListener('keydown', ()=>{
  socket.emit('chat:typing:mobile', {username: username.value});
})





//////ESCUCHAR O RECIBIR INFORMACIÓN DEL SERVIDOR///////////////////////////////////////////////////

//Recibe el mensaje renviado por el Servidor para que se muestre en los clientes
socket.on('Chat:Message:Server', (datos)=>{
  actions.innerHTML = "";
  output.innerHTML += `<p>
    <strong>${datos.username}</strong>:${datos.message}
  </p>`
});

//Recibe el usuario que esta escribiendo del servidor para que se muestre en los clientes (Menos al que esta escribiendo)
socket.on('chat:typing', (datos)=>{
  actions.innerHTML = `<p><em>${datos.username} is typing a message</em></p>`;
})

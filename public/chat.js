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
let uploadImage = document.getElementById('uploadImage');
let uploadFile = document.getElementById('uploadFile');
//////MANDAR INFORMACIÓN AL SERVIDOR///////////////////////////////////////////////////


const validar = () =>{
  if ($(username).val().length == 0) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Ingrese un Nombre de Usuario',
    })
    return false;
  }

  if ($(message).val().length == 0) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Ingrese un mensaje',
    })
    return false;
  }
}


//Para mandar mensjae al server al pulsar el boton send
btn.addEventListener('click', function(){
    //Para mandar los datos al servidor usamos la variable socket que vendría siendo el socket conectado con el server
    //.emit() Requiere 2 parametros, 1. Nombre, 2. Datos


    if(validar()!=false){
      socket.emit('Chat:Message',{
        message : message.value,
        username : username.value
      });

      /*Para que el scroll del div siempre esta abajo al momento de agregar un nuevo mensaje, con una
      pequeña animación de deslizamiento*/
      $(output).animate({ scrollTop: $(output).prop("scrollHeight")}, 1000);

      message.value = "";
    }

})

//Para mostrar que un usuario esta escribiendo desde la ("PC")
message.addEventListener('keypress', ()=>{
  socket.emit('chat:typing', {username: username.value});
})

//Para mostrar que un usuario esta escribiendo desde de ("Mobile")
message.addEventListener('keydown', ()=>{
  socket.emit('chat:typing:mobile', {username: username.value});
})

//Función para poder subir una imagen mandarla al servidor y que se muestre en los todos los clientes (incluyendome)
$(function(){
  $(uploadImage).on('change', function(e){
    var file = e.originalEvent.target.files[0];
    var reader = new FileReader();
    reader.onload = function(evt){
      //Enviarmos la imagen
      socket.emit('Chat:image', { username:username.value, image: evt.target.result});
    }
    reader.readAsDataURL(file);
  });
});


//Función para subir cualquier fichero y mostrar un link en cada servidor para descargar dicho Fichero
//Estas funciones fueron sacadas de: https://github.com/sffc/socketio-file-upload
//Para su instalacion ejecutar: npm install --save socketio-file-upload

var uploader = new SocketIOFileUpload(socket);
uploader.listenOnInput(uploadFile);//Escucha el evento, es decir al seleccionar un fichero y lo manda al servidor


$(function(){
  $(uploadFile).on('change', function(e){
      socket.emit('Chat:FileUser', { username:username.value});
  });
});


//////ESCUCHAR O RECIBIR INFORMACIÓN DEL SERVIDOR///////////////////////////////////////////////////

//Recibe el mensaje renviado por el Servidor para que se muestre en los clientes

socket.on('Chat:Message:Server', (datos)=>{
  var FH = new Date();
  actions.innerHTML = "";
  output.innerHTML += `
  <div>
    <img id="icon-message" src="img/icon_user.svg" alt="user">

    <section>
      <p><strong>${datos.username}</strong>: </p>
      <div class="text-message">
        <p>${datos.message}</p>
      </div>
      <p id="time">${FH.toLocaleString('en-MX', { hour: 'numeric', minute: 'numeric', hour12: true })}</p>
    </section>
  </div>`

  $(output).animate({ scrollTop: $(output).prop("scrollHeight")}, 1000);
});

//Recibe el usuario que esta escribiendo del servidor para que se muestre en los clientes (Menos al que esta escribiendo)
socket.on('chat:typing', (datos)=>{
  actions.innerHTML = `<p><em>${datos.username} is typing a message</em></p>`;
})


//Recibe imagen del servidor y los muestra en el HTML
socket.on('Show:Image', function(base64image){
  var FH = new Date();
  output.innerHTML += `
  <div>
    <img id="icon-message" src="img/icon_user.svg" alt="user">

    <section>
      <p><strong>${base64image.username}</strong>: </p>
      <div class="text-message">
        <p><img src = "${base64image.image}" /></p>
      </div>
      <p id="time">${FH.toLocaleString('en-MX', { hour: 'numeric', minute: 'numeric', hour12: true })}</p>
    </section>
  </div>`
  $(output).animate({ scrollTop: $(output).prop("scrollHeight")}, 1000);
});

//Recibe el usuario que mando el archivo y los muestra en el chat
socket.on('Show:File', function(datos){
  actions.innerHTML = "";
  output.innerHTML += `
  <div>
    <section>
      <p><strong>${datos.username}</strong>:</p>
      <div class="text-message">
      </div>
    </section>
  </div>`
});

//Recibe unicamente el nombre del archivo que el cliente mando
socket.on('Chat:File', function(url){
  var FH = new Date();
  //Muestro en html una etiqueta <a> cuando un cliente mande un fichero

  /*Para poder acceder al la direccion de img en este caso sería: http://OUR_IP:3000/uploads/NAME_IMG
    es necesario establecer un ruta en el servidor de .get
  */
  actions.innerHTML = "";
  output.innerHTML += `
  <div>
    <img id="icon-message" src="img/icon_user.svg" alt="user">

    <section>
      <div class="text-message">
        <p><a href="${url}" download>Descargar Fichero : ${url}</a></p>
      </div>
      <p id="time">${FH.toLocaleString('en-MX', { hour: 'numeric', minute: 'numeric', hour12: true })}</p>
    </section>
  </div>`
  $(output).animate({ scrollTop: $(output).prop("scrollHeight")}, 1000);
})

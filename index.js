//SERVER SIDE
//SERVER CODE
const path = require('path');//Para poder trabajar con rutas
const express = require('express');//IMPORTAMOS EXPRESS
const app = express();//App encargado de tener todas las configuraciones del SERVIDOR
const siofu = require("socketio-file-upload");//Importo este modulo para poder subir ficheros desde los clientes


//SETTINGS
app.set('port', process.env.PORT || 3000);


//TO START THE SERVER
//I put my IP to connect other devices with this SERVER
const server = app.listen(app.get('port'), '192.168.1.65', ()=>{
  console.log("Server on port:", app.get('port'));
});
app.use(siofu.router);


//STATIC FILES para que el servidor llame a los archivos como html, css y javascript

//__dirname es del module Path y es lo mismo que la direccion de este proyecto -> C:\Users\Efren\Downloads\Chat V1
app.use(express.static(path.join(__dirname, 'public')));//Esto es para llamar todos los archivos estaticos como
//html, css, javascript etc.


/////////////////////////////////////////////////////////////////////////////////
//WEBSOCKETS

const SocketIO = require('socket.io');//Solcitamos el modulo para el socket
const io = SocketIO(server); //El socket requiere un servidor ya inicilizado por ende le pasamos
//el app el cual tiene la configuraciones del servidor y este esta almacenado en
//la variable server.

var name = "";
io.on('connection', (socket)=>{
  //Para detectar cuando un cliente se conecta al socket
  console.log('New Connection', socket.id);

  socket.on('Chat:Message', (datos)=>{
      //Al usar io.sockets.emit estamos mandando datos a todos los clientes incluyendome
      console.log(`Username: ${datos.username}  ||  Message: ${datos.message}`);
      io.sockets.emit('Chat:Message:Server', datos);
  })

  socket.on('chat:typing', (datos)=>{
    //Al usar socket.broadcast.emit estamos mandando datos a todos los servidores EXECEPTO A MI MISMO.
    socket.broadcast.emit('chat:typing', datos);
    console.log(`Username: ${datos.username} is typing`);
  })

  socket.on('chat:typing:mobile', (datos)=>{
    //Al usar socket.broadcast.emit estamos mandando datos a todos los servidores EXECEPTO A MI MISMO.
    socket.broadcast.emit('chat:typing', datos);
    console.log(`Username: ${datos.username} is typing`);
  })


  socket.on('Chat:image', (datos)=>{
    io.sockets.emit('Show:Image', datos);
    console.log(`Username: ${datos.username} sent image`);
  })


  var uploader = new siofu();
  uploader.dir = path.join(__dirname, 'uploads');
  uploader.listen(socket);

  uploader.on("saved", function(event){
      io.sockets.emit('Chat:File', event.file.name);
      name = event.file.name;

  });

  socket.on('Chat:FileUser', (datos)=>{
    console.log(`Username: ${datos.username} sent a file`);
    io.sockets.emit('Show:File', datos);
  })

});



//RUTAS

/*Esta ruta es para poder acceder a una img especifica del la carpeta uploads y permitir a los clientes
  descargar ficheros
*/
app.get('/:uploads', function(req, res){
    res.sendFile( __dirname + `/uploads/${name}` );
});

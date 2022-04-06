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

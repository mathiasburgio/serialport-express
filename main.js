const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline');
const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

// Configurar Express
const expressApp = express();
const PORT = 3505; // Puerto donde se expondrá el servidor Express
var serialPort = null;
var lastData = "";

expressApp.use(favicon(path.join(__dirname, 'public', 'resources', 'icono.ico')))
expressApp.use(cors());
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: true }));

expressApp.use("/resources", express.static( path.join(__dirname, "public/resources") ))
expressApp.use("/css", express.static( path.join(__dirname, "public/css") ))
expressApp.use("/js", express.static( path.join(__dirname, "public/js") ))

expressApp.get("/ping", (req, res)=>{
    res.status(200).send("pong");
})

expressApp.get("/", (req, res)=>{
    res.sendFile( __dirname + "/public/views/index.html")
})
expressApp.get("/get-data", (req, res)=>{
    res.status(200).send(lastData);
})

expressApp.post("/connect", (req, res)=>{
    
    serialPort = new SerialPort({
        path: req.body.puerto,         // Reemplaza 'COM3' con el puerto de tu dispositivo
        baudRate: Number(req.body.baudrate)        // Asegúrate de que el baudRate sea el correcto
    }, err =>{
        if(err && err.toString().indexOf("Error") > -1){
            res.status(200).json({error: true, message: err.toString()});
        }else{
            serialPort.on('data', function (data) {
                console.log(data);
                let dataString = Buffer.from(data).toString('utf-8').trim();
                if(req.body.modoLectura == "mantener"){
                    if(dataString != "") lastData = dataString; //actualiza el valor solo si tiene info
                }else if(req.body.modoLectura == "actualizar"){
                    lastData = dataString; //muestra siempre el valor actual
                }
            })
            res.status(200).send("OK");
        }
    });
})
expressApp.post("/disconnect", (req, res)=>{
    if(serialPort){
        serialPort.close((err)=>{
            if(err) console.log(err);
        })
    }
    serialPort = null;
    res.status(200).send("OK");
})

expressApp.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 600,
    icon: path.join(__dirname, 'public', 'resources', 'icono.ico'),
    webPreferences: {
        nodeIntegration: false,
        contextIsolation: false,
        enableRemoteModule: false
    },
  });

  if(process?.env?.NODE_ENV == "development"){
        setTimeout(()=>{
            win.maximize();
            win.webContents.openDevTools();
        },3000);
    }else{
        Menu.setApplicationMenu(null);
    }

  win.loadURL('http://localhost:3505/'); // Carga el archivo HTML si tienes una interfaz
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
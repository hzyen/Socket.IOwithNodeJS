const { strict } = require('assert');
const express = require('express');
const fs = require('fs');
const path = require('path');
const Proxy = require('http-proxy').createProxyServer();
const config = require(path.join(__dirname, "../config/global.json"));
const port = config.Server.settings.port;
const app = express();

const ProxyServer = 'http://10.101.0.181:' + config.Proxy.settings.port;

/**
 * WebSocket Configuration
 */
const io = require('socket.io')(config.Server.settings.socket, {
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": req.headers.origin,
            "Access-Control-Allow-Credentials": true,
            "Socket Powered By:": "Emiga Stream https://github.com/eminmuhammadi/emiga-stream.git"
        };
        res.writeHead(200, headers);
        res.end();
    },
    cors: {
        origin: "http://10.101.0.181:8000",
        methods: ["GET", "POST"]
    },
    path: '/',
    serveClient: true,
    origins: '*:*',
    cookie: true,
    pingInterval: 1000,
    pingTimeout: 1000,
    upgradeTimeout: 1000,
    allowUpgrades: true,
    cookie: 'emiga_stream',
    cookiePath: '/',
    cookieHttpOnly: true
});

function byteCount(s) {
    return encodeURI(s).split(/%..|./).length - 1;
}

function getBinarySize(string) {
    return Buffer.byteLength(string, 'utf8');
}

io.on('connection', function (socket) {
    let date_ob = new Date();
    console.log(date_ob.getHours() + ':' + date_ob.getMinutes() + ':' + date_ob.getSeconds() + ':' + date_ob.getMilliseconds() + ' connection.');

    socket.emit('allow_emit', 'firstTime'); // emit client to start emitting

    socket.on('stream', function (buffer) {
        //fs.writeFile(`output/${Date.now()}.png`, data.replace(/^data:image\/webp;base64,/, ""), 'base64', (err) => {
        //    if (err) throw err;
        //    console.log('Streamed! Image(png) size: ' + );
        //});
        const view = new Int32Array(buffer);
        //var size = getBinarySize(hugePacket[0]['a'][0]['a']) * 12;
        //var size = getBinarySize(view);
    
        // for(giantPacket in hugePacket){
        //     for(img in giantPacket){
        //         //for(img in packet){
        //             console.log(getBinarySize(img));
        //             size += getBinarySize(img);
        //         //}
        //     }
        // }

        let date_ob = new Date();
        console.log(date_ob.getHours() + ':' + date_ob.getMinutes() + ':' + date_ob.getSeconds() + ':' + date_ob.getMilliseconds() + '    Streamed! Image(png) size: ' +  buffer.byteLength);

        socket.emit('allow_emit', 'secondTime');
    });

    socket.on('imgFile', function (buffer) {
        console.log('base64 file size: ');
        socket.emit('sendagain', 'secondTime');
    });

    socket.on('disconnect', () => {
        console.log('client disconnected');
    });
});

/**
 * Run Proxy Server
 */
app.all("/*", function (req, res) {
    Proxy.web(req, res, { target: ProxyServer });
});

app.listen(port, () => {
    console.log(`\x1b[40m`, `\x1b[32m`,
        `
     _______  __   __  ___   _______  _______ 
    |       ||  |_|  ||   | |       ||   _   |
    |    ___||       ||   | |    ___||  |_|  |
    |   |___ |       ||   | |   | __ |       |
    |    ___||       ||   | |   ||  ||       |
    |   |___ | ||_|| ||   | |   |_| ||   _   |
    |_______||_|   |_||___| |_______||__| |__|
 
    [+] Maintance      : https://github.com/eminmuhammadi/emiga-stream.git
    [+] Server         : http://localhost:${port}
    [+] Socket         : ws://localhost:${config.Server.settings.port}
    [~] Running Server...
`, `\x1b[0m`);
});

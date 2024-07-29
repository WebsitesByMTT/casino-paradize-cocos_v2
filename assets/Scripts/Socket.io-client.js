const io = require("socket.io-client")

let lobby;

const SOCKET_OPTIONS = {
    transport : ['websocket', 'xhr-polling'],
    forceNew: true
}

let connectSocketServer = (host, port) => {
    casinoParadiseLobby = io('ws://' + host + ':' + port, SOCKET_OPTIONS);
    casinoParadiseLobby.on("connect", () => {
       console.log("connecting");
    });
   
}
let lobbyRequst = (data, cb) => {
    casinoParadiseLobby.emit("request", data, (res) => {
        // console.log("Socket Request", res, data);
        // cb(res);
    })
}

module.exports = {
    connectSocketServer,
    lobbyRequst
}


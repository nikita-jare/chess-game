//ws library for websockets
import {WebSocketServer} from 'ws';
import { GameManager } from './GameManager';

const wss = new WebSocketServer({ port : 8080 });

const gameManager = new GameManager();
//tsc -b
//node dist/index.js --> seems like working. Do we need http server? -- yes it works. try using postwoman
wss.on('connection', function connection(ws){
    // ws.on('error', console.error);
    gameManager.addUser(ws)
    // ws.on('message', function message(data){
    //     console.log('received: %s', data);
    // });

    // ws.send('something');
    ws.on('disconnect', () => gameManager.removeUser(ws) );
});


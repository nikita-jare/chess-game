import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./Messages";
import { Game } from "./Game";

export class GameManager {
    private games: Game[];
    private pendingUser: WebSocket | null;
    private users: WebSocket[];

    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }

    addUser(socket: WebSocket){
        this.users.push(socket);
        this.addHandler(socket);
    }

    removeUser(socket: WebSocket){
        this.users = this.users.filter(user => user !== socket);
        //stop the game here because user left
    }

    private addHandler(socket: WebSocket){
        socket.on('message', (data) => {
            const message = JSON.parse(data.toString());

            if(message.type === INIT_GAME){
                if(this.pendingUser){
                    //start a game
                    // console.log(this.pendingUser);
                    const game = new Game(this.pendingUser, socket);
                    // console.log(game);
                    this.games.push(game);
                    this.pendingUser = null;
                    console.log("Game started");
                } else {
                    //the user is the first participant
                    this.pendingUser = socket;
                    console.log("Wait for other user to join");
                    // console.log(this.pendingUser);
                }
            }

            if(message.type === MOVE){
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if(game){
                    game.makeMove(socket, message.payload.move);
                }
            }
        })
    }
}
import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./Messages";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    private board: Chess;
    private startTime: Date;

    constructor(player1: WebSocket, player2: WebSocket){
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black"
            }
        }));
        console.log("In constructor");
        console.log(this.board.moveNumber());
    }

    makeMove(socket: WebSocket, move:{
        from: string,
        to: string
    }){
        //validate the type of move using zod
        //validation - 1. make sure is it this users move
        //2. Is the move valid
        //Use chess.js library for moves validation

        //Update the board
        try{
            this.board.move(move);
            // console.log(this.board.move(move));
            console.log(move);
            console.log(this.board.moveNumber());
            if(this.board.moveNumber() % 2 !== 0 && socket !== this.player1){
                console.log("Return 1 happened")
                return;
            }
            if(this.board.moveNumber() % 2 === 0 && socket !== this.player2){
                console.log("Return 2 happened")
                return
            }
            // console.log("After move is made");
            // console.log(this.board.moveNumber());
            // if(this.player1 === socket) console.log("Player1");
            // if(this.player2 === socket) console.log("Player2");

        }catch(e){
            console.log(e);
            return;
        }
        


        //Check if the game is over
        if(this.board.isGameOver()){
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }))
            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }))
            return;
        }

        //Send the updated board to both the users - if game is not over
        if(this.board.moveNumber() % 2 !== 0 ){
            // console.log("Send update to player1");
            // console.log(this.board.moveNumber());
            // if(this.player1 === socket) console.log("Player1");
            // if(this.player2 === socket) console.log("Player2");
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        } else {
            // console.log("Send update to player2");
            // console.log(this.board.moveNumber());
            // if(this.player1 === socket) console.log("Player1");
            // if(this.player2 === socket) console.log("Player2");
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        }
        // console.log("At the end");
        // console.log(this.board.moveNumber());
        // if(this.player1 === socket) console.log("Player1");
        // if(this.player2 === socket) console.log("Player2");

    }
}
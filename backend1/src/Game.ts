import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./Messages";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    public board: Chess;
    private startTime: Date;
    private moveCount = 0;

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
        
        // console.log("In constructor");
        // console.log(this.board.moveNumber());
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
        
            console.log(move);
            console.log(this.board.moveNumber());
            console.log(this.board);

            if (this.moveCount % 2 === 0 && socket !== this.player1) {
                return
            }
            if (this.moveCount % 2 === 1 && socket !== this.player2) {
                return;
            }

        try{    
            this.board.move(move);
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
        if(this.moveCount % 2 === 0){
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        } else {
                this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        }
        this.moveCount++;
    }
}
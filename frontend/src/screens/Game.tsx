import { ChessBoard } from "../components/ChessBoard";
import { Button } from "../components/Button";
import { useSocket } from "../hooks/useSocket";
import { useEffect, useState } from "react";
import { Chess } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

export const Game = () => {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [started, setStarted] = useState(false)

    useEffect(()=>{
        if(!socket) return;

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);
            switch(message.type){
                case INIT_GAME:
                    //setChess(new Chess());
                    setBoard(chess.board());
                    setStarted(true);
                    console.log("Game Initialised")
                    break;
                case MOVE:
                    const move = message.payload;
                    // console.log(move);
                    // console.log("In Game.tsx before move", chess.board());
                    chess.move(move);
                    setBoard(chess.board());
                    // console.log("In Game.tsx after move", chess.board());
                    console.log("Move made");
                    break;
                case GAME_OVER:
                    console.log("Game Over")
                    break;
            }
        }
    }, [socket])

    if(!socket) return <div>Connecting... </div>
    return(
        <div className="justify-center flex">
            <div className="pt-8 max-w-screen-lg w-full">
                <div className="grid grid-cols-6 gap-4 w-full">
                    <div className="col-span-4 w-full flex justify-center">
                        <ChessBoard chess={chess} setBoard = {setBoard} socket = {socket} board = {board}/>
                    </div>
                    <div className="col-span-2 bg-slate-900 w-full flex justify-center">
                        <div className="pt-8">
                            {!started && <Button onClick={()=>{
                                socket.send(JSON.stringify({
                                    type:INIT_GAME
                                }))
                            }}>
                            Play
                        </Button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
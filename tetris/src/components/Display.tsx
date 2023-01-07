import React from "react";
import { StyledDisplay } from "./styles/StyledDisplay";
interface Props {
    gameOver: boolean
    text:string
}
function Display({gameOver, text}:Props){
    return(
        <StyledDisplay gameOver={gameOver}>{text}</StyledDisplay>
    )

}
export default Display

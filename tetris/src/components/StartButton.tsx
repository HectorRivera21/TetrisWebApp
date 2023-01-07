import React from "react";
import { StyledStartButton } from "./styles/StyledStartButton";
function StartButton({callBack}:any){
    return(
        <StyledStartButton onClick={callBack}>Start Game</StyledStartButton>
    )
}
export default StartButton
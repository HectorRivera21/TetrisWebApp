import React from "react";
interface Props {
    gameOver: boolean
    text:string
}
function Display({gameOver, text}:Props){
    return(
        <div>{text}</div>
    )

}
export default Display

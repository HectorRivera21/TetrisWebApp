import React from "react";
import Cell from "./Cell"

function Stage({stage}:any){
    return(
        <div>
            {stage.map((row:any)=>row.map((cell:any,x:number)=><Cell key={x} type={cell[0]}/>))}
        </div>
    )

}
export default Stage
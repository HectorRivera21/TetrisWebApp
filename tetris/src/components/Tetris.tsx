import React from "react";

import { createStage } from "../gameHelpers";

import Stage from "./Stage";
import Display from "./Display";
import StartButton from "./StartButton";


function Tetris()
{
    return (
        <div>
            <Stage stage={createStage()}/>
            <aside>
                <div>
                    <Display gameOver={true} text ="Score"/>
                    <Display gameOver={true}text ="Rows"/>
                    <Display gameOver={true}text ="Level"/>
                </div>
                <StartButton />
            </aside>
        </div>
    );
};


export default Tetris

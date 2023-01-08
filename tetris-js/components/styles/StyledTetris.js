import styled from "styled-components";
import JOJO from '../../img/785352.jpg';

export const StyledTetrisWrapper = styled.div`
    width: 100vw;
    height: 100vw;
    background: url(${JOJO});
    background-size: cover;
    overflow: hidden;
`

export const StyledTetris = styled.div`
    display:flex;
    align-items: flex-start;
    padding: 40px;
    margin: 0 auto;
    max-width: 900px;


    aside{
        width: 100%;
        max-width: 200px;
        display: block;
        padding: 0 20px;
    }
`
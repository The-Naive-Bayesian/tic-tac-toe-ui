import * as React from 'react';
import './Board.css';
import Square from "./Square";

const Board = ({boardState, clickHandleGenerator}) => {
    const squareMapGenerator = (y) => (icon, x) => <Square icon={icon} onClick={clickHandleGenerator(x, y)} key={`(${x},${y})`} />;

    const mapRows = (row, y) => (
        <div className={'row'} key={y}>
            {row.map(squareMapGenerator(y))}
        </div>
    );

    return (
        <section className={"board"}>
            {boardState.map(mapRows)}
        </section>
    )
};

export default Board;
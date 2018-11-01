import * as React from 'react';
import './Board.css';
import Square from "./Square";

const Board = ({boardState, clickHandleGenerator}) => {
    const valueMap = {
        0: null,
        1: {fill: 'black'},
        2: {fill: 'red'},
        3: {fill: 'grey'},
    };

    const squareMapGenerator = (y) => (value, x) => (
        <Square
            icon={valueMap[value]}
            onClick={clickHandleGenerator(x, y)}
            key={`(${x},${y})`}
        />
    );

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
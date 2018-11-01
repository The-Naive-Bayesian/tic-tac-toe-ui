import React, { Component } from 'react';
import './App.css';
import Board from "./Board";

const initialState = {
    boardState: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ],
    potentialNextState: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ],
    selectedSquare: null,
    loading: false,
    complete: false,
    winner: null
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {...initialState};
    }

    saveMove = () => {
        const {selectedSquare} = this.state;

        if (!selectedSquare) {
            return false;
        }
        const newState = this._fillWithNumber(selectedSquare.x, selectedSquare.y, 1);
        this.setState({
            loading: true,
            selectedSquare: null
        });
        this.getOpponentMove(newState).then(({boardState, finished, winner}) => this.setState({
            boardState,
            potentialNextState: boardState,
            loading: false,
            complete: finished,
            winner
        }));
    };

    getOpponentMove = (boardState) => {
        return fetch('https://wt-c9e7248ce110a8011618a06ccf73d34f-0.sandbox.auth0-extend.com/tic-tac-toe', {
            method: 'POST',
            mode: "cors",
            headers: {"Content-Type": "application/json; charset=utf-8"},
            body: JSON.stringify({
                boardState
            })
        }).then(res => {
            return res.json();
        });
    };

    clickHandleGenerator = (x, y) => {
        return () => {
            const nextState = this._fillWithNumber(x, y, 3);
            if (nextState) {
                this.setState({
                    potentialNextState: nextState,
                    selectedSquare: {x, y}
                })
            }
        };
    };

    newGame = () => {
        this.setState({...initialState})
    };

    _fillWithNumber = (x, y, number) => {
        // Fill w black circle
        const {boardState} = this.state;
        const canFill = this._canFill(x, y);
        if (!canFill) {
            return null;
        }
        return this._replaceSquare(boardState, x, y, number);
    };

    _replaceSquare = (board, x, y, replaceWith) => {
        const newState = [];

        for (let i=0; i<3; i++) {
            if (i === y) {
                const newRow = board[y].map((square, index) => (index === x) ? replaceWith : square);
                newState.push(newRow);
            } else {
                newState.push(board[i])
            }
        }
        return newState;
    };

    _canFill = (x, y) => {
        // Currently: fill if not populated
        const {boardState} = this.state;
        return !boardState[y][x];
    };

    render() {
        const {potentialNextState, loading, complete, winner} = this.state;
        const winnerMap = {
            0: 'It was a tie!',
            1: 'You win!',
            2: 'You lost!',
        };
        return (
            <div className="App">
                <header>Tic Tac Toe</header>
                {loading ? <h2>Thinking...</h2> : null}
                {
                    complete
                        ? <h2>Game Over: {winnerMap[winner]}</h2>
                        : null
                }
                <Board boardState={potentialNextState} clickHandleGenerator={this.clickHandleGenerator}/>

                {
                    complete
                    ? null
                    : <button className={'save'} onClick={this.saveMove}>Save Move</button>
                }
                <button className={'save'} onClick={this.newGame}>New Game</button>
            </div>
        );
    }
}

export default App;
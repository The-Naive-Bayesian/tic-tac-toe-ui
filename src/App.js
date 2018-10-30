import React, { Component } from 'react';
import './App.css';
import Board from "./Board";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            boardState: [
                [{fill: 'black'}, null, null],
                [null, {fill: 'red'}, null],
                [null, null, {fill: 'black'}],
            ],
            potentialNextState: [
                [{fill: 'black'}, null, null],
                [null, {fill: 'red'}, null],
                [null, null, {fill: 'black'}],
            ],
            selectedSquare: null,
            loading: false,
            complete: false,
            playerWon: false
        }
    }

    saveMove = () => {
        const {selectedSquare} = this.state;

        if (!selectedSquare) {
            return false;
        }
        const newState = this._fillWithColor(selectedSquare.x, selectedSquare.y, 'black');
        this.setState({
            boardState: newState,
            potentialNextState: newState,
            loading: true,
        });
        this.getOpponentMove().then(newState => this.setState({
            boardState: newState,
            potentialNextState: newState,
            loading: false
        }));
    };

    getOpponentMove = () => {
        return fetch('http://localhost:4200/tic-tac-toe', {
            method: 'POST',
            mode: "cors",
            headers: {"Content-Type": "application/json; charset=utf-8"},
            body: JSON.stringify(this.state.boardState)
        }).then(res => {
            return res.json();
        });
    };

    clickHandleGenerator = (x, y) => {
        return () => {
            const nextState = this._fillWithColor(x, y, 'grey');
            if (nextState) {
                this.setState({
                    potentialNextState: nextState,
                    selectedSquare: {x, y}
                })
            }
        };
    };

    _fillWithColor = (x, y, color) => {
        // Fill w black circle
        const {boardState} = this.state;
        const canFill = this._canFill(x, y);
        if (!canFill) {
            return null;
        }
        return this._replaceSquare(boardState, x, y, {fill: color});
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
        const {potentialNextState, loading, complete, playerWon} = this.state;
        return (
            <div className="App">
                <header>Tic Tac Toe</header>
                {loading ? <h2>Thinking...</h2> : null}
                {
                    complete
                        ? <h2>Game Over: {`you ${playerWon ? 'won': 'lost'}!`}</h2>
                        : null
                }
                <Board boardState={potentialNextState} clickHandleGenerator={this.clickHandleGenerator}/>
                <button className={'save'} onClick={this.saveMove}>Save Move</button>
            </div>
        );
    }
}

export default App;
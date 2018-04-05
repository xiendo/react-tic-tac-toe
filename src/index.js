import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key={i}
                value={this.props.squares[i].player}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderRow(chunk_index, row_chunk){

        let row = [];

        for(let i=0; i < row_chunk.length; i++){
            row.push(this.renderSquare(row_chunk[i]));
        }

        return (
            <div key={chunk_index} className="board-row">
                {row}
            </div>
        );
    }

    render() {

        let board = [];
        const square_keys = this.props.squares.map((value, index) => {
            return index;
        });
        const chunks = chunkArray(square_keys, this.props.length);

        for(let i=0; i < chunks.length; i++){

            board.push(this.renderRow(i, chunks[i]));

        }

        return (
            <div>
                {board}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.square_length = 4;
        this.square_count = Math.pow(this.square_length, 2);

        this.state = {
            history: [
                {
                    squares: this.create_square_data_set(this.square_length)
                }
            ],
            stepNumber: 0,
            xIsNext: true
        };

    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    create_square_data_set(square_length){

        let data_set	= [];
        let row = 1;
        let column = 1;

        for ( let x = 0; x < square_length; x++ ) {
            console.log('outer loop');
            for ( let i = 0; i < square_length; i++ ) {

                data_set.push({
                    position: {
                        row: row,
                        column: column,
                    },
                    player: null
                });
                column ++;
            }
            row ++;
            column = 1;
        }

        return data_set;

    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        //

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        length={this.square_length}
                        count={this.square_count}
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

/**
 * Splits an array into chunks given a size
 *
 * @param arr
 * @param chunk_size
 * @returns {Array}
 */
function chunkArray( arr, chunk_size){

    let chunk;
    let chunks = [];

    for (let i = 0; i < arr.length; i += chunk_size) {
        chunk = arr.slice(i, i + chunk_size);
        chunks.push(chunk);
    }

    return chunks;
}
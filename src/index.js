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
        const chunks = chunkArray(square_keys, this.props.board_width);

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

        this.board_width = 5;
        this.square_count = Math.pow(this.board_width, 2);
        this.diagonal_wins = this.getDiag();
        this.state = {
            history: [
                {
                    squares: this.create_square_data_set(this.board_width)
                }
            ],
            stepNumber: 0,
            current_player: 'O',
            current_square: null,
            xIsNext: true,
        };

    }

    handleClick(i) {

        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = JSON.parse(JSON.stringify(current.squares));

        /**
         * Prevents unnecessary square click events
         */
        if (this.getWinner(squares)|| squares[i].player) {
            return;
        }

        squares[i].player = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares
                }
            ]),
            stepNumber: history.length,
            current_player: squares[i].player,
            current_position: squares[i].position,
            xIsNext: !this.state.xIsNext
        });

    }

    create_square_data_set(square_length){

        let data_set	= [];
        let row = 1;
        let column = 1;

        for ( let x = 0; x < square_length; x++ ) {
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

    getWinner( square_data_set ){

        const current_player = this.state.current_player;
        const player_data_set = square_data_set.filter( ( value, index, arr ) => {
            return (value.player === current_player);
        });

        if(player_data_set.length >= this.board_width){

            //check row wins
            const row = player_data_set.filter( ( value, index, arr ) => {
                return (value.position.row === this.state.current_position.row);
            });

            if(row.length === this.board_width){
                return this.state.current_player;
            }

            //check col wins
            const column = player_data_set.filter( ( value, index, arr ) => {
                return (value.position.column === this.state.current_position.column)
            });

            if(column.length === this.board_width){
                return this.state.current_player;
            }

            //Check diagnonal wins
            for(let d = 0; d< this.diagonal_wins.length; d++){

                let results = [];

                for(let x = 0; x< this.diagonal_wins[d].length; x++){

                    const row = this.diagonal_wins[d][x].row;
                    const column = this.diagonal_wins[d][x].column;

                    let found_results = player_data_set.filter( ( value, index, arr ) => {
                        return (value.position.row === row && value.position.column === column);
                    });

                    results = results.concat(found_results);

                    if(results.length === this.board_width){
                        return this.state.current_player;
                    }

                }

            }

        }

        return false;
    }

    getDiag(){

        let result = [];
        let diag_one = [];
        let diag_two = [];

        for(let i = 1; i <= this.board_width; i++){

            diag_one.push({
                row: i,
                column: i
            });

            diag_two.push({
                row: i,
                column: this.board_width - (i - 1)
            });

        }

        result.push(diag_one);
        result.push(diag_two);

        return result;

    }


    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = this.getWinner(current.squares);

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
                        board_width={this.board_width}
                        square_count={this.square_count}
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
import React from 'react';
import {boardHasCenter, getCorners, getDiagSquareIndexes, create_square_data_set, boardWidthMinMax} from './helpers';
import HistoryOrderBtn from './HistoryOrderBtn';
import BoardSizeInput from './BoardSizeInput';
import Board from './Board';

export default class Game extends React.Component {

    constructor(props){
        super(props);

        this.handleHistoryOrderClick = this.handleHistoryOrderClick.bind(this);
        this.handleBoardSizeInput = this.handleBoardSizeInput.bind(this);

        this.state = {
            board_width: 3,
            square_count: 9,
            center: 4,
            corners: [0, 2, 6, 8],
            diag_square_indexes: [
                [0, 4, 8],
                [2, 4, 6]
            ],
            history: [
                {
                    squares: create_square_data_set(3),
                    player: null,
                    position: null
                }
            ],
            stepNumber: 0,
            current_player: 'O',
            current_position: null,
            xIsNext: true,
            historyAsc: true
        };

    }

    /**
     * Runs when a player checks a square and stores/updates the state/data
     *
     * @param i
     */
    handleSquareClick(i) {

        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = JSON.parse(JSON.stringify(current.squares));

        /**
         * Prevents unnecessary square click events
         */
        if (this.getWinningData(squares)|| squares[i].player) {
            return;
        }

        squares[i].player = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares,
                    player: squares[i].player,
                    position: Object.assign(squares[i].position, {index: i})
                }
            ]),
            stepNumber: history.length,
            current_player: squares[i].player,
            current_position: Object.assign(squares[i].position, {index: i}),
            xIsNext: !this.state.xIsNext,
        });

    }


    /**
     * Re-orders the moves list in ASC/DESC
     */
    handleHistoryOrderClick(){

        this.setState({
            historyAsc: !this.state.historyAsc
        })
    }


    /**
     * Handles the board width input and updates the state w/ corresponding values given a board width
     *
     * @param e
     */
    handleBoardSizeInput(e){

        const input_value = e.target.value;
        let board_width,
            square_count;

        //empty input OR not a number
        if(isNaN(input_value)){
            return;
        }

        board_width = Math.round(boardWidthMinMax(input_value, 3, 20));
        square_count = Math.pow(board_width, 2);

        this.setState({
            board_width: board_width,
            square_count: square_count,
            center: ( boardHasCenter(board_width) ) ? Math.round(square_count / 2) - 1 : false,
            corners: getCorners(board_width, square_count),
            diag_square_indexes: getDiagSquareIndexes(board_width, square_count),
            history: [
                {
                    squares: create_square_data_set(board_width),
                    player: null,
                    position: null
                }
            ],
            stepNumber: 0,
            current_player: 'O',
            current_position: null,
            xIsNext: true,
            historyAsc: true
        })
    }


    /**
     * Jump to a step in the history of the game
     *
     * @param step
     */
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }


    /**
     * Get the relevant data for the win.
     *  - Player
     *  - squares positions
     *
     * @param current_squares
     * @returns {*}
     */
    getWinningData( current_squares ){

        const current_player = this.state.current_player;
        const player_data_set = current_squares.filter( ( value, index, arr ) => {
            return (value.player === current_player);
        });

        //player has enough moves to win
        if(player_data_set.length >= this.state.board_width){

            //check row wins
            const row = player_data_set.filter( ( value, index, arr ) => {
                return (value.position.row === this.state.current_position.row);
            });
            if(row.length === this.state.board_width){
                return {
                    winner: this.state.current_player,
                    squares: row
                };
            }

            //check col wins
            const column = player_data_set.filter( ( value, index, arr ) => {
                return (value.position.column === this.state.current_position.column)
            });
            if(column.length === this.state.board_width){
                return {
                    winner: this.state.current_player,
                    squares: column
                }
            }

            //Check diagonal wins
            //Bail early if player does not have center OR at least 2 corners
            if(
                ( this.state.center && !this.currentPlayerOwnsCenter(current_squares) ) ||
                !this.currentPlayerHasEnoughCorners(current_squares)

            ){
                return false;
            }

            //Run diagonal win check
            for(let d = 0; d < this.state.diag_square_indexes.length; d++){

                let result = [];

                for(let i = 0; i < this.state.diag_square_indexes[d].length; i++){

                    const square_index = this.state.diag_square_indexes[d][i];

                    if(
                        typeof current_squares[square_index] !== 'undefined' &&
                        current_squares[square_index].hasOwnProperty('player') &&
                        current_squares[square_index].player === this.state.current_player
                    ){
                        result.push(current_squares[square_index]);
                    }

                }

                if(result.length === this.state.board_width){
                    return {
                        winner: this.state.current_player,
                        squares: result
                    }
                }

            }

        }

        return false;

    }


    /**
     * Checks if the current player has checked the center position on the board
     *
     * @param current_squares
     * @returns {number|boolean}
     */
    currentPlayerOwnsCenter(current_squares){

        return (
            this.state.center &&
            Number.isInteger(this.state.center) &&
            current_squares[this.state.center].player === this.state.current_player
        )

    }


    /**
     * Checks if current player has at least 2 corners in the same line
     *
     * @param squares
     * @returns {Array}
     */
    currentPlayerHasEnoughCorners(squares){

        const current_player = this.state.current_player;

        return (
            ( squares[this.state.corners[0]].player === current_player && squares[this.state.corners[3]].player === current_player ) ||
            ( squares[this.state.corners[1]].player === current_player && squares[this.state.corners[2]].player === current_player )
        );

    }


    render() {

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winning_data = this.getWinningData(current.squares);

        const moves = history.map((step, move) => {

            const font_weight = ( move === this.state.stepNumber) ? 700 : 300;
            const desc = move ?
                `${move}. Player ${step.player}: ( row: ${step.position.row}, column: ${step.position.column} )` :
                'START';
            return (
                <li key={move}>
                    <button style={{ fontWeight: font_weight }} className='history-btns' onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        //reverse history order if user toggled ASC/DESC btn
        if( !this.state.historyAsc ){
            const start_btn = moves.shift();
            moves.reverse().unshift(start_btn);
        }

        let status;
        if (winning_data) {

            status = "Winner: " + winning_data.winner;
            winning_data.indexes = winning_data.squares.map((value, index) => value.position.index);

        }
        else if(this.state.stepNumber === this.state.square_count){
            status = "Draw";
        }
        else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        board_width={this.state.board_width}
                        square_count={this.state.square_count}
                        squares={current.squares}
                        onClick={i => this.handleSquareClick(i)}
                        winning_data={winning_data}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <h3>Go to a move</h3>
                    <BoardSizeInput handleChange={this.handleBoardSizeInput} />
                    <HistoryOrderBtn
                        className="history-btns"
                        value={(!this.state.historyAsc) ? "Ascending" : "Descending" }
                        onClick={ i => this.handleHistoryOrderClick(i)}
                        historyAsc={this.state.historyAsc}
                    />
                    <ol id='moves-list'>{moves}</ol>
                </div>
            </div>
        );
    }

}
import React from 'react';
import {create_square_data_set} from './helpers';
import HistoryOrderBtn from './HistoryOrderBtn';
import Board from './Board';

export default class Game extends React.Component {

    constructor(props) {
        super(props);

        this.board_width = 4;
        this.square_count = Math.pow(this.board_width, 2);
        this.center = ( this.boardHasCenter() ) ? Math.round(this.square_count / 2) - 1 : false;
        this.corners = this.getCorners();
        this.diag_square_indexes = this.getDiagSquareIndexes();
        this.handleHistoryOrderClick = this.handleHistoryOrderClick.bind(this);

        this.state = {
            history: [
                {
                    squares: create_square_data_set(this.board_width),
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


    handleHistoryOrderClick(){
        this.setState({
            historyAsc: !this.state.historyAsc
        })
    }


    /**
     * Helps reduce diagonal win checks
     *
     * @returns {boolean}
     */
    boardHasCenter(){
        return (this.board_width % 2 === 1)
    }

    /**
     * Gets the index value of each corner of the square/board
     */
    getCorners(){

        //corner 1
        let corners = [0];
        //corner 2
        corners.push(this.board_width - 1);
        //corner 3
        corners.push((this.square_count - 1) - (this.board_width -1));
        //corner 4
        corners.push(this.square_count - 1);

        return corners;

    }


    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }


    getWinningData( current_squares ){

        const current_player = this.state.current_player;
        const player_data_set = current_squares.filter( ( value, index, arr ) => {
            return (value.player === current_player);
        });

        //player has enough moves to win
        if(player_data_set.length >= this.board_width){

            //check row wins
            const row = player_data_set.filter( ( value, index, arr ) => {
                return (value.position.row === this.state.current_position.row);
            });
            if(row.length === this.board_width){
                return {
                    winner: this.state.current_player,
                    squares: row
                };
            }

            //check col wins
            const column = player_data_set.filter( ( value, index, arr ) => {
                return (value.position.column === this.state.current_position.column)
            });
            if(column.length === this.board_width){
                return {
                    winner: this.state.current_player,
                    squares: column
                }
            }

            //Check diagonal wins
            //Bail early if player does not have center OR at least 2 corners
            if(
                ( this.center && !this.currentPlayerOwnsCenter(current_squares) ) ||
                !this.currentPlayerHasEnoughCorners(current_squares)

            ){
                return false;
            }

            //Run diagonal win check
            for(let d = 0; d < this.diag_square_indexes.length; d++){

                let result = [];

                for(let i = 0; i < this.diag_square_indexes[d].length; i++){

                    const square_index = this.diag_square_indexes[d][i];

                    if(
                        typeof current_squares[square_index] !== 'undefined' &&
                        current_squares[square_index].hasOwnProperty('player') &&
                        current_squares[square_index].player === this.state.current_player
                    ){
                        result.push(current_squares[square_index]);
                    }

                }

                if(result.length === this.board_width){
                    return {
                        winner: this.state.current_player,
                        squares: result
                    }
                }

            }

        }

        return false;

    }


    currentPlayerOwnsCenter(current_squares){

        return (
            this.center &&
            Number.isInteger(this.center) &&
            current_squares[this.center].player === this.state.current_player
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
            ( squares[this.corners[0]].player === current_player && squares[this.corners[3]].player === current_player ) ||
            ( squares[this.corners[1]].player === current_player && squares[this.corners[2]].player === current_player )
        );

    }


    /**
     * Gets the square's diagonal indexes
     *
     * @returns {[null,null]}
     */
    getDiagSquareIndexes(){

        let diag_one = [];
        let diag_two = [];
        let result = [diag_one, diag_two];

        for(let i = 0; i <= (this.square_count - 1); i += this.board_width + 1){
            diag_one.push(i);
        }

        for(let d = this.board_width - 1; d <= (this.square_count - this.board_width); d += this.board_width - 1){
            diag_two.push(d);
        }

        return result;

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
        else if(this.state.stepNumber === this.square_count){
            status = "Draw";
        }
        else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        board_width={this.board_width}
                        square_count={this.square_count}
                        squares={current.squares}
                        onClick={i => this.handleSquareClick(i)}
                        winning_data={winning_data}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <h3>Go to a move</h3>
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
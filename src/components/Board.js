import React from 'react';
import Square from './Square';
import {chunkArray} from './helpers';

/**
 * Render's the Tic Tac Toe Game Board
 */
export default class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key={i}
                value={this.props.squares[i].player}
                onClick={() => this.props.onClick(i)}
                winning_data={this.props.winning_data}
                background_color={(this.props.winning_data && this.props.winning_data.indexes.includes(i) ? "#00c4ff" : "#fff")}
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
        const board_width = this.props.board_width;
        const chunks = chunkArray(square_keys, board_width);
        for(let i=0; i < chunks.length; i++){
            board.push(this.renderRow(i, chunks[i]));
        }

        return (<div>{board}</div>);
    }
}
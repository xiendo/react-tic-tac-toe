import React from "react";
import { Table, Icon } from "semantic-ui-react";
import { chunkArray } from "./helpers";

/**
 * Render's the Tic Tac Toe Game Board
 */
export default class Board extends React.Component {
  renderSquare(i) {
    const { winning_data, squareDimensions } = this.props;
    const { width, height } = squareDimensions;

    const backgroundColor =
      winning_data && winning_data.indexes.includes(i) ? "#00c4ff" : "#000";
    const playerIconName =
      this.props.squares[i].player === "X" ? "x" : "circle outline";
    const content = this.props.squares[i].player ? (
      <Icon className="board-icon" name={playerIconName} />
    ) : null;

    return (
      <Table.Cell
        key={i}
        className="square"
        verticalAlign="middle"
        onClick={() => this.props.onClick(i)}
        content={content}
        style={{
          backgroundColor,
          width,
          height
        }}
      />
    );
  }

  renderRow(chunk_index, row_chunk) {
    let row = [];
    for (let i = 0; i < row_chunk.length; i++) {
      row.push(this.renderSquare(row_chunk[i]));
    }
    return <Table.Row key={chunk_index}>{row}</Table.Row>;
  }

  renderBoard() {
    const square_keys = this.props.squares.map((value, index) => {
      return index;
    });
    const board_width = this.props.board_width;
    const chunks = chunkArray(square_keys, board_width);
    return chunks.map((squareSet, index) => {
      return this.renderRow(index, squareSet);
    });
  }

  render() {
    return (
      <Table
        id="game-board"
        unstackable
        celled
        inverted
        selectable
        collapsing
        compact={true}
      >
        <Table.Body>{this.renderBoard()}</Table.Body>
      </Table>
    );
  }
}

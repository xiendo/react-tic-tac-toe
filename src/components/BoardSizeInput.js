import React from "react";

/**
 * Renders the board size/width input field
 *
 * @param props
 * @returns {XML}
 * @constructor
 */
function BoardSizeInput(props) {
  return (
    <div>
      <h3>
        Board Size<input
          onChange={props.handleChange}
          id="board-size-input"
          type="text"
          size="1"
          maxLength="2"
        />
      </h3>
    </div>
  );
}

export default BoardSizeInput;

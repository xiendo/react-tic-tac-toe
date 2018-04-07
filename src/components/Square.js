import React from 'react';

/**
 * Renders a square in the Tic Tac Toe board
 *
 * @param props
 * @returns {XML}
 * @constructor
 */
function Square(props){
    return (
        <button style={{ backgroundColor: props.background_color }} className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

export default Square;
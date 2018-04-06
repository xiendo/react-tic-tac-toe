import React from 'react';

function Square(props){
    return (
        <button style={{ backgroundColor: props.background_color }} className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

export default Square;
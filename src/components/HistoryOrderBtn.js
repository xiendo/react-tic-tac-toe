import React from 'react';

function HistoryOrderBtn(props){
    return (
        <button className={props.className} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

export default HistoryOrderBtn;
import React, { useContext } from 'react';
import { AppContext } from '../Play';

function Key({ keyVal, bigKey, disabled, almost, correct }) {
    const { onDelete, onEnter, onSelectLetter } = useContext(AppContext);

    const selectLetter = () => {
        if (keyVal === "ENTER") {
            onEnter();
        } else if (keyVal === "DELETE") {
            onDelete();
        } else {
            onSelectLetter(keyVal);
        }
    };

    // Constructing the id based on different conditions
    const getId = () => {
        if (bigKey) return "big";
        if (disabled) return "disabled";
        if (almost) return "almost";
        if (correct) return "correct";
        return "";
    };

    return (
        <div className="key" id={getId()} onClick={selectLetter}>
            {keyVal}
        </div>
    );
}

export default Key;

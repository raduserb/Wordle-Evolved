import React, { useContext } from 'react';
import { AppContext } from '../Training';

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
        if (correct) return "correct";
        if (almost) return "almost";
        return "";
    };

    return (
        <div className="key" id={getId()} onClick={selectLetter}>
            {keyVal}
        </div>
    );
}

export default Key;

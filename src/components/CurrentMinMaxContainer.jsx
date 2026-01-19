import { useState } from "react";
import "./CurrentMinMaxContainer.css";
import { DateTime } from "luxon";

function CurrentMinMaxContainer({current, minValue, maxValue, minDate, maxDate, emoji, small}) {
    return <>
        <div 
            className={`current-min-max-container ${small ? 'small' : ''}`} 
            onClick={() => setExpanded(prev => !prev)}
        >
            <div className="inline-block-container">
                <p className="emoji">{emoji}</p>
                <p className="current-value">{current}</p>
                <div className="min-max-container">
                    <p>
                        <span style={{fontWeight: "bold", color: "green", fontSize:"1em"}}>↑</span>
                        {`${maxValue} в ${DateTime.fromMillis(maxDate).toFormat('HH:mm')}`}
                    </p>
                    <p>
                        <span style={{fontWeight: "bold", color: "red", fontSize:"1em"}}>↓</span>
                        {`${minValue} в ${DateTime.fromMillis(minDate).toFormat('HH:mm')}`}
                    </p>
                </div>
            </div>
        </div>
    </>;
}

export default CurrentMinMaxContainer;
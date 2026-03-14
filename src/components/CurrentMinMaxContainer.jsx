import { useState } from "react";
import "./CurrentMinMaxContainer.css";
import { DateTime } from "luxon";

function CurrentMinMaxContainer({current, minValue, maxValue, minDate, maxDate, emoji, small}) {
    const maxDateString = Number.isInteger(maxDate) ? DateTime.fromMillis(maxDate).toFormat('HH:mm') : '';
    const minDateString = Number.isInteger(minDate) ? DateTime.fromMillis(minDate).toFormat('HH:mm') : '';

    return <>
        <div 
            className={`current-min-max-container ${small ? 'small' : ''}`}
        >
            <div className="inline-block-container">
                <p className="emoji">{emoji}</p>
                <p className="current-value">{current}</p>
                <div className="min-max-container">
                    {maxValue && 
                        <p>
                            <span style={{fontWeight: "bold", color: "green", fontSize:"1em"}}>↑</span>
                            {`${maxValue} в ${DateTime.fromMillis(maxDate).toFormat('HH:mm')}`}
                        </p>
                    }
                    {minValue && 
                        <p>
                            <span style={{fontWeight: "bold", color: "red", fontSize:"1em"}}>↓</span>
                            {`${minValue} в ${DateTime.fromMillis(minDate).toFormat('HH:mm')}`}
                        </p>
                    }
                </div>
            </div>
        </div>
    </>;
}

export default CurrentMinMaxContainer;
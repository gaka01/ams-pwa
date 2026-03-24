import "./CurrentMinMaxContainer.css";
import { DateTime } from "luxon";

interface Props {
  current: string;
  minValue?: string;
  maxValue?: string;
  minDate: number | undefined;
  maxDate: number | undefined;
  emoji: string;
  small?: boolean;
}

function CurrentMinMaxContainer({ current, minValue, maxValue, minDate, maxDate, emoji, small }: Props) {
  return (
    <div className={`current-min-max-container ${small ? 'small' : ''}`}>
      <div className="inline-block-container">
        <p className="emoji">{emoji}</p>
        <p className="current-value">{current}</p>
        <div className="min-max-container">
          {maxValue && maxDate !== undefined &&
            <p>
              <span style={{ fontWeight: "bold", color: "green", fontSize: "1em" }}>↑</span>
              {`${maxValue} в ${DateTime.fromMillis(maxDate).toFormat('HH:mm')}`}
            </p>
          }
          {minValue && minDate !== undefined &&
            <p>
              <span style={{ fontWeight: "bold", color: "red", fontSize: "1em" }}>↓</span>
              {`${minValue} в ${DateTime.fromMillis(minDate).toFormat('HH:mm')}`}
            </p>
          }
        </div>
      </div>
    </div>
  );
}

export default CurrentMinMaxContainer;

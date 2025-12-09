import styles from "./ToggleSwitch.module.css";

const ToggleSwitch = ({
  isOn,
  onToggle,
  disabled = false,
  leftLabel,
  rightLabel,
  align = "inline",
  leftColor = "#3b82f6",
  rightColor = "#3b82f6",
  knobClassName = "",
  leftLabelClassName = "",
  rightLabelClassName = "",
}) => {
  const wrapperClasses =
    align === "center"
      ? "d-flex justify-content-center align-items-center"
      : "d-flex align-items-center";

  const trackStyle = {
    backgroundColor: isOn ? rightColor : leftColor,
  };

  return (
    <div className={wrapperClasses}>
      {leftLabel && (
        <span
          className={[
            styles.label,
            leftLabelClassName,
            !isOn ? styles.labelActive : styles.labelInactive,
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ cursor: disabled ? "default" : "pointer" }}
          onClick={() => {
            if (!disabled && isOn) onToggle();
          }}
        >
          {leftLabel}
        </span>
      )}

      <button
        type="button"
        className={styles.track}
        style={trackStyle}
        onClick={onToggle}
        disabled={disabled}
      >
        <div
          className={[styles.knob, knobClassName].filter(Boolean).join(" ")}
          style={{
            transform: isOn ? "translateX(26px)" : "translateX(2px)",
          }}
        />
      </button>

      {rightLabel && (
        <span
          className={[
            styles.label,
            rightLabelClassName,
            isOn ? styles.labelActive : styles.labelInactive,
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ cursor: disabled ? "default" : "pointer" }}
          onClick={() => {
            if (!disabled && !isOn) onToggle();
          }}
        >
          {rightLabel}
        </span>
      )}
    </div>
  );
};

export default ToggleSwitch;

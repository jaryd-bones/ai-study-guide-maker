import ToggleSwitch from "../../common/ToggleSwitch/ToggleSwitch.jsx"
import styles from "./MemorizationToggle.module.css";

const MemorizationToggle = ({
  isMemorized,
  onToggle,
  disabled,
  leftLabelClassName,
  rightLabelClassName,
}) => {
  // Allow default styling to be overwritten
  const effectiveLeftLabelClassName =
    leftLabelClassName ?? styles.memorizationLabelWideLeft;

  const effectiveRightLabelClassName =
    rightLabelClassName ?? styles.memorizationLabelWideRight;

  return (
    <ToggleSwitch
      isOn={isMemorized}
      onToggle={onToggle}
      disabled={disabled}
      leftLabel="Needs Review"
      rightLabel="Memorized"
      leftColor="#facc15"
      rightColor="#4ade80"
      leftLabelClassName={effectiveLeftLabelClassName}
      rightLabelClassName={effectiveRightLabelClassName}
    />
  );
};

export default MemorizationToggle;

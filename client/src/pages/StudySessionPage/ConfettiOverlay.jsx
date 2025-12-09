import styles from "./StudySessionPage.module.css";

const ConfettiOverlay = ({ active }) => {
  if (!active) return null;

  const pieces = Array.from({ length: 90 });
  const colors = ["#f97316", "#22c55e", "#3b82f6", "#eab308", "#ec4899"];

  return (
    <div className={styles.confettiOverlay}>
      {pieces.map((_, index) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 1.4;
        const rotate = Math.random() * 360;
        const color = colors[index % colors.length];

        return (
          <span
            key={index}
            className={styles.confettiPiece}
            style={{
              left: `${left}%`,
              backgroundColor: color,
              animationDelay: `${delay}s`,
              transform: `rotateZ(${rotate}deg)`,
            }}
          />
        );
      })}
    </div>
  );
};

export default ConfettiOverlay;

import { PlayFill, Eye } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import styles from "./DashboardPage.module.css";

const StudyGuideListItem = ({ guide }) => {
  // Expect id, title, description, created_at
  return (
    <article className={styles.studyGuideCard}>
      <header className={styles.studyGuideCardHeader}>
        <h2 className={styles.studyGuideTitle}>
          <Link to={`/study-guides/${guide.id}`}>{guide.title}</Link>
        </h2>
      </header>

      {guide.description && (
        <p className={styles.studyGuideDescription}>{guide.description}</p>
      )}

      <footer className={`${styles.studyGuideFooter} d-flex gap-2`}>
        <Link
          to={`/study-guides/${guide.id}`}
          className="btn btn-secondary d-flex align-items-center gap-1"
        >
          <Eye size={18} />
          View
        </Link>

        <Link
          to={`/study-guides/${guide.id}/study`}
          className="btn btn-primary d-flex align-items center"
        >
          <PlayFill size={20} />
          Study
        </Link>
      </footer>
    </article>
  );
}

export default StudyGuideListItem;

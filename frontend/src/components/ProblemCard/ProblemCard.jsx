import "./ProblemCard.css";
import { Link } from "react-router-dom";
function ProblemCard({ problem }) {
    return (
        <div className="problem-card">
            <span>{problem.id}</span>
            <Link to={`/problem/${problem.id}`}>
                <h3>{problem.title}</h3>
            </Link>
            <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>
                {problem.difficulty}
            </span>
          <span className="acceptance">{problem.acceptance}</span>
            <span>○</span>
        </div>
    );
}
export default ProblemCard;

import "./ProblemCard.css";
import { Link } from "react-router-dom";

function ProblemCard({ problem }) {
    return (
        <div className="problem-card">
            <span>{problem.id}</span>
            <Link to={`/problem/${problem.id}`}>
                <h3>{problem.title}</h3>
            </Link>
            <span>{problem.difficulty}</span>
            <span>{problem.acceptance}</span>
        </div>
    );
}
export default ProblemCard;
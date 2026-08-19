import problems from "../../data/problems";
import ProblemCard from "../../components/ProblemCard/ProblemCard";
import "./Problems.css";

function Problems() {
    return (
        <div className="problems-container">
            <div className="problems-header"> 
        <span>#</span> 
        <h3>Problem</h3> 
        <span>Difficulty</span> 
        <span>Acceptance</span> 
        </div>
                {problems.map((problem) => (
                <ProblemCard
                    key={problem.id}
                    problem={problem}
                />
            ))}
        </div>
    );
}

export default Problems;
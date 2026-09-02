import { useParams } from "react-router-dom";
import { useState } from "react";
import problems from "../../data/problems";
import axios from "axios";
import "./ProblemDetail.css";
function ProblemDetail() {
    const { id } = useParams();
    const problem = problems.find(
        (item) => item.id === Number(id)
    );
    const codeLines = [
        "class Solution {",
        "    public int twoSum() {",
        "        return 0;",
        "    }",
        "}"
    ];
    const [results, setResults] = useState([]);
    const [code, setCode] = useState(codeLines.join("\n"));
    const [output, setOutput] = useState("");
    const [status, setStatus] = useState("");
    const handleRun = async () => {
        try {
            const response = await axios.post(
                "http://localhost:5000/run",
                {
                    code: code,
                    testCases: problem.testCases,
                }
            );
            setOutput(response.data.output);
        } catch (error) {
            setOutput("Server error");
        }
    };
    const handleSubmit = async () => {
        try {
            const response = await axios.post(
                "http://localhost:5000/submit",
                {
                    code: code,
                    testCases: problem.testCases
                }
            );
            setStatus(response.data.status);
            setResults(response.data.results);
        } catch (error) {
            setStatus("Server Error");
            setOutput("Unable to connect to server");
        }
    };
    return (
        <div className="problem-detail">
            <div className="problem-content">
                <h1>{problem.title}</h1>
                <p>{problem.difficulty}</p>
                <p>{problem.acceptance}</p>
                <p>Description</p>
                <p>{problem.description}</p>
                <h2>Examples</h2>
                {problem.examples.map((example, index) => {
                    return (
                        <div className="example" key={index}>
                            <h3>Example {index + 1}</h3>
                            <p>input: {example.input}</p>
                            <p>output: {example.output}</p>
                      </div>
                    );
                })}
                {results.map((result) => (
                    <div key={result.testCase}>
                        <h3>
                            Test Case {result.testCase}
                        </h3>
                        <p>
                            Expected: {result.expected}
                        </p>
                        <p>
                            Your Output: {result.actual}
                        </p>
                        <p>
                            {result.passed
                                ? "✅ Passed"
                                : "❌ Failed"}
                        </p>
                    </div>
                ))}
                <h2>Constraints</h2>
                <ul>
                    {problem.constraints.map((constraint, index) => {
                        return (
                            <li key={index}>
                                {constraint}
                           </li>
                        );
                    })}
                </ul>
            </div>
            <div className="code-section">
                <div className="editor-header">
                    Java
                </div>
                <div className="code-area">
                    <div className="line-numbers">
                        {code.split("\n").map((line, index) => {
                            return (
                                <div key={index}>
                                    {index + 1}
                                </div>
                            );
                        })}
                    </div>
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                </div>
                <div className="editor-actions">
                    <button onClick={handleRun}>
                        Run
                    </button>
                    <button onClick={handleSubmit}>
                        Submit
                    </button>
                </div>
                {status && (
                    <div className="status-section">
                        <h3>{status}</h3>
                    </div>
                )}
                {output && (
                    <div className="output-section">
                        <h3>Output</h3>
                        <pre>{output}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}
export default ProblemDetail;
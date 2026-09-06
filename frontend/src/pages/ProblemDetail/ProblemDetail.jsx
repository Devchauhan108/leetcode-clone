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
        "    public int[] twoSum(int[] nums, int target) {",
        "        return new int[]{};",
        "    }",
        "}"
    ];

    const [code, setCode] = useState(codeLines.join("\n"));
    const [output, setOutput] = useState("");
    const [status, setStatus] = useState("");
    const [results, setResults] = useState([]);

    const [activeTab, setActiveTab] = useState("testcase");
    const [selectedTestCase, setSelectedTestCase] = useState(0);


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

            setResults(response.data.results || []);

        } catch (error) {

            setStatus("Server Error");

            setOutput("Unable to connect to server");

        }

    };


    return (

        <div className="problem-detail">


            {/* ================= LEFT PANEL ================= */}

            <div className="problem-content">

                <h1>{problem.title}</h1>

                <p>{problem.difficulty}</p>

                <p>{problem.acceptance}</p>


                <p>Description</p>

                <p>{problem.description}</p>


                <h2>Examples</h2>

                {problem.examples.map((example, index) => {

                    return (

                        <div
                            className="example"
                            key={index}
                        >

                            <h3>
                                Example {index + 1}
                            </h3>

                            <p>
                                input: {example.input}
                            </p>

                            <p>
                                output: {example.output}
                            </p>

                        </div>

                    );

                })}


                {/* ================= TEST RESULTS ================= */}

                {results.length > 0 && (

                    <div className="results-section">


                        {/* TABS */}

                        <div className="results-header">

                            <button
                                onClick={() =>
                                    setActiveTab("testcase")
                                }
                            >
                                Testcase
                            </button>


                            <button
                                onClick={() =>
                                    setActiveTab("result")
                                }
                            >
                                Test Result
                            </button>

                        </div>


                        {/* ================= TESTCASE TAB ================= */}

                        {activeTab === "testcase" && (

                            <div className="results-list">


                                {/* CASE BUTTONS */}

                                <div className="testcase-tabs">

                                    {results.map((result, index) => (

                                        <button
                                            key={index}
                                            onClick={() =>
                                                setSelectedTestCase(index)
                                            }
                                        >
                                            Case {index + 1}
                                        </button>

                                    ))}

                                </div>


                                {/* SELECTED TESTCASE */}

                                <div className="result-item">

                                    <h3>
                                        Test Case{" "}
                                        {selectedTestCase + 1}
                                    </h3>


                                    <p>
                                        Input:{" "}
                                        {JSON.stringify(
                                            results[selectedTestCase].input
                                        )}
                                    </p>


                                    <p>
                                        Expected Output:{" "}
                                        {results[selectedTestCase].expected}
                                    </p>

                                </div>


                            </div>

                        )}


                        {/* ================= RESULT TAB ================= */}

                        {activeTab === "result" && (

                            <div className="results-list">

                                {results.map((result) => (

                                    <div
                                        className={`result-item ${
                                            result.passed
                                                ? "passed"
                                                : "failed"
                                        }`}
                                        key={result.testCase}
                                    >

                                        <h3>
                                            Test Case{" "}
                                            {result.testCase}
                                        </h3>


                                        <p>
                                            Expected:{" "}
                                            {result.expected}
                                        </p>


                                        <p>
                                            Your Output:{" "}
                                            {result.actual}
                                        </p>


                                        <p>

                                            {result.passed
                                                ? "✓ Passed"
                                                : "✕ Failed"}

                                        </p>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>

                )}


                {/* ================= CONSTRAINTS ================= */}

                <h2>Constraints</h2>

                <ul>

                    {problem.constraints.map(
                        (constraint, index) => {

                            return (

                                <li key={index}>
                                    {constraint}
                                </li>

                            );

                        }
                    )}

                </ul>

            </div>


            {/* ================= RIGHT CODE PANEL ================= */}

            <div className="code-section">


                <div className="editor-header">
                    Java
                </div>


                <div className="code-area">


                    {/* LINE NUMBERS */}

                    <div className="line-numbers">

                        {code.split("\n").map(
                            (line, index) => {

                                return (

                                    <div key={index}>
                                        {index + 1}
                                    </div>

                                );

                            }
                        )}

                    </div>


                    {/* CODE EDITOR */}

                    <textarea
                        value={code}
                        onChange={(e) =>
                            setCode(e.target.value)
                        }
                    />

                </div>


                {/* BUTTONS */}

                <div className="editor-actions">

                    <button onClick={handleRun}>
                        Run
                    </button>


                    <button onClick={handleSubmit}>
                        Submit backend
                    </button>

                </div>


                {/* STATUS */}

                {status && (

                    <div className="status-section">

                        <h3>
                            {status}
                        </h3>

                    </div>

                )}


                {/* OUTPUT */}

                {output && (

                    <div className="output-section">

                        <h3>
                            Output
                        </h3>

                        <pre>
                            {output}
                        </pre>

                    </div>

                )}

            </div>

        </div>

    );

}

export default ProblemDetail;
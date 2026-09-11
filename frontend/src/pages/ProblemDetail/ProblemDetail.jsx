import { useParams } from "react-router-dom";
import { useState } from "react";
import problems from "../../data/problems";
import Editor from "@monaco-editor/react";
import axios from "axios";
import "./ProblemDetail.css";

function ProblemDetail() {
    const { id } = useParams();

    const problem = problems.find(
        (item) => item.id === Number(id)
    );

    const testCases = problem?.testCases || [];

    const codeLines = [
        "class Solution {",
        "    public int[] twoSum(int[] nums, int target) {",
        "        return new int[]{};",
        "    }",
        "}"
    ];

    const [code, setCode] = useState(
        codeLines.join("\n")
    );

    const [output, setOutput] = useState("");
    const [status, setStatus] = useState("");
    const [results, setResults] = useState([]);

    const [activeTab, setActiveTab] =
        useState("testcase");

    const [selectedTestCase, setSelectedTestCase] =
        useState(0);


    // =========================
    // RUN
    // =========================

    const handleRun = async () => {

        if (testCases.length === 0) {
            setOutput("No test cases available.");
            return;
        }

        try {

            setStatus("");
            setOutput("");

            const response = await axios.post(
                "http://localhost:5000/run",
                {
                    code: code,

                    testCases: [
                        testCases[selectedTestCase]
                    ]
                }
            );

            const testCase =
                testCases[selectedTestCase];

            const actual =
                response.data.output
                    .trim()
                    .replace(/\s+/g, "");

            const expected =
                JSON.stringify(testCase.expected)
                    .trim()
                    .replace(/\s+/g, "");

            setOutput(
                response.data.output
            );

            setResults([
                {
                    testCase:
                        selectedTestCase + 1,

                    input:
                        testCase.input,

                    expected:
                        expected,

                    actual:
                        actual,

                    passed:
                        actual === expected
                }
            ]);

            setActiveTab("testcase");

        } catch (error) {

            console.error(error);

            setOutput(
                "Unable to run the code."
            );
        }
    };


    // =========================
    // SUBMIT
    // =========================

    const handleSubmit = async () => {

        if (testCases.length === 0) {
            setStatus("No Test Cases");
            return;
        }

        try {

            setStatus("");
            setResults([]);
            setOutput("");

            const response =
                await axios.post(
                    "http://localhost:5000/submit",
                    {
                        code: code,
                        testCases: testCases
                    }
                );

            setStatus(
                response.data.status
            );

            setResults(
                response.data.results || []
            );

            setActiveTab("testcase");

            setSelectedTestCase(0);

        } catch (error) {

            console.error(error);

            setStatus("Server Error");

            setOutput(
                "Unable to connect to server"
            );
        }
    };


    // =========================
    // MONACO EDITOR MOUNT
    // =========================

    const handleEditorMount = (editor, monaco) => {

        // Ctrl + Enter → Run

        editor.addCommand(
            monaco.KeyMod.CtrlCmd |
            monaco.KeyCode.Enter,

            () => {
                handleRun();
            }
        );


        // Ctrl + Shift + Enter → Submit

        editor.addCommand(
            monaco.KeyMod.CtrlCmd |
            monaco.KeyMod.Shift |
            monaco.KeyCode.Enter,

            () => {
                handleSubmit();
            }
        );
    };


    // =========================
    // PROBLEM NOT FOUND
    // =========================

    if (!problem) {

        return (
            <div className="problem-detail">

                <h2>
                    Problem not found
                </h2>

            </div>
        );
    }


    return (

        <div className="problem-detail">


            {/* =========================
                LEFT SIDE
            ========================= */}

            <div className="problem-content">

                <h1>
                    {problem.id}. {problem.title}
                </h1>


                <div className="problem-meta">

                    <span
                        className={`difficulty ${problem.difficulty.toLowerCase()}`}
                    >
                        {problem.difficulty}
                    </span>

                    <span>
                        Acceptance: {problem.acceptance}
                    </span>

                </div>


                {/* Description */}

                <div className="description">

                    <p>
                        {problem.description}
                    </p>

                </div>


                {/* Examples */}

                {problem.examples &&
                    problem.examples.length > 0 && (

                        <div className="examples">

                            <h2>
                                Examples
                            </h2>

                            {problem.examples.map(
                                (example, index) => (

                                    <div
                                        className="example"
                                        key={index}
                                    >

                                        <h3>
                                            Example {index + 1}
                                        </h3>

                                        <p>
                                            <strong>
                                                Input:
                                            </strong>{" "}
                                            {example.input}
                                        </p>

                                        <p>
                                            <strong>
                                                Output:
                                            </strong>{" "}
                                            {example.output}
                                        </p>

                                    </div>

                                )
                            )}

                        </div>

                    )}


                {/* Constraints */}

                {problem.constraints &&
                    problem.constraints.length > 0 && (

                        <div className="constraints">

                            <h2>
                                Constraints
                            </h2>

                            <ul>

                                {problem.constraints.map(
                                    (constraint, index) => (

                                        <li key={index}>
                                            {constraint}
                                        </li>

                                    )
                                )}

                            </ul>

                        </div>

                    )}

            </div>


            {/* =========================
                RIGHT SIDE
            ========================= */}

            <div className="code-section">


                {/* Editor Header */}

                <div className="editor-header">

                    <span>
                        Java
                    </span>

                </div>


                {/* Monaco Editor */}

                <div className="code-area">

    <Editor
        height="100%"
        width="100%"
        language="java"
        theme="vs-dark"

        value={code}

        onChange={(value) =>
            setCode(value || "")
        }

        onMount={handleEditorMount}

        options={{
            fontSize: 14,

            minimap: {
                enabled: false
            },

            automaticLayout: true,

            tabSize: 4,

            insertSpaces: true,

            wordWrap: "off",

            lineNumbers: "on",

            scrollBeyondLastLine: false,

            padding: {
                top: 10,
                bottom: 10
            },

            suggestOnTriggerCharacters: true,

            quickSuggestions: true,

            bracketPairColorization: {
                enabled: true
            }
        }}
    />

</div>{/* =========================
                    EDITOR ACTIONS
                ========================= */}

                <div className="editor-actions">

                    <button
                        onClick={handleRun}
                    >
                        Run
                    </button>


                    <button
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>

                </div>


                {/* =========================
                    STATUS
                ========================= */}

                {status && (

                    <div
                        className={`status-section ${
                            status === "Accepted"
                                ? "accepted"
                                : "wrong-answer"
                        }`}
                    >

                        <h3>
                            {status}
                        </h3>

                    </div>

                )}


                {/* =========================
                    TESTCASE SECTION
                ========================= */}

                <div className="results-section">


                    {/* Tabs */}

                    <div className="result-tabs">

                        <button
                            className={
                                activeTab === "testcase"
                                    ? "active"
                                    : ""
                            }

                            onClick={() =>
                                setActiveTab(
                                    "testcase"
                                )
                            }
                        >
                            Testcase
                        </button>


                        <button
                            className={
                                activeTab === "result"
                                    ? "active"
                                    : ""
                            }

                            onClick={() =>
                                setActiveTab(
                                    "result"
                                )
                            }
                        >
                            Test Result
                        </button>

                    </div>


                    {/* =========================
                        TESTCASE TAB
                    ========================= */}

                    {activeTab === "testcase" && (

                        <div className="testcase-panel">


                            {/* Case Buttons */}

                            <div className="testcase-tabs">

                                {testCases.map(
                                    (_, index) => (

                                        <button
                                            key={index}

                                            className={
                                                selectedTestCase ===
                                                index
                                                    ? "active"
                                                    : ""
                                            }

                                            onClick={() => {

                                                setSelectedTestCase(
                                                    index
                                                );

                                                setOutput("");

                                            }}
                                        >
                                            Case {index + 1}
                                        </button>

                                    )
                                )}

                            </div>


                            {/* Selected Case */}

                            {testCases.length > 0 && (

                                <div className="testcase-content">

                                    <h4>
                                        Input
                                    </h4>

                                    <pre>
                                        {JSON.stringify(
                                            testCases[
                                                selectedTestCase
                                            ].input
                                        )}
                                    </pre>


                                    <h4>
                                        Expected Output
                                    </h4>

                                    <pre>
                                        {JSON.stringify(
                                            testCases[
                                                selectedTestCase
                                            ].expected
                                        )}
                                    </pre>

                                </div>

                            )}

                        </div>

                    )}


                    {/* =========================
                        TEST RESULT TAB
                    ========================= */}

                    {activeTab === "result" && (

                        <div className="test-result-panel">

                            {results.length === 0 ? (

                                <p>
                                    Run or Submit your
                                    code to see results.
                                </p>

                            ) : (

                                results.map(
                                    (result, index) => (

                                        <div
                                            className="result-card"
                                            key={index}
                                        >

                                            <h4>
                                                Testcase{" "}
                                                {result.testCase}
                                            </h4>


                                            <p>
                                                <strong>
                                                    Input:
                                                </strong>{" "}
                                                {JSON.stringify(
                                                    result.input
                                                )}
                                            </p>


                                            <p>
                                                <strong>
                                                    Expected:
                                                </strong>{" "}
                                                {result.expected}
                                            </p>


                                            <p>
                                                <strong>
                                                    Your Output:
                                                </strong>{" "}
                                                {result.actual}
                                            </p>


                                            <p
                                                className={
                                                    result.passed
                                                        ? "passed"
                                                        : "failed"
                                                }
                                            >
                                                {result.passed
                                                    ? "✓ Passed"
                                                    : "✗ Failed"}
                                            </p>

                                        </div>

                                    )
                                )

                            )}

                        </div>

                    )}

                </div>

            </div>

        </div>

    );
}

export default ProblemDetail;
import { useParams } from "react-router-dom"; 
import { useState } from "react";
import problems from "../../data/problems"; 
import "./ProblemDetail.css"; 
function ProblemDetail(){ 
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
        const [code, setCode] = useState(codeLines.join("\n"));
        const [output, setOutput] = useState("");
        const [status, setStatus] = useState("");
        const [input, setInput] = useState("");
        const [target, setTarget] = useState("");
     const handleRun = () => {
    setStatus("");

    if (input === "") {
        setOutput("Please enter input");
        return;
    }

    const nums = input.split(" ").map(Number);
    const targetNumber = Number(target);

    let answer = [];

    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {

            if (nums[i] + nums[j] === targetNumber) {
                answer = [i, j];
            }

        }
    }

    if (answer.length > 0) {
        setOutput(`[${answer[0]}, ${answer[1]}]`);
    } else {
        setOutput("No solution");
    }
};
        const handleSubmit = () => {
            setStatus("Accepted");
        };
    return( 
     <div className="problem-detail"> 
        <div className="problem-content"> 
        <h1>{problem.title}</h1> 
        <p>{problem.difficulty}</p> 
        <p>{problem.acceptance}</p> 
        <p>Description</p> 
        <p>{problem.description}</p> 
        <h2> Examples</h2> 
        {problem.examples.map((example,index)=>{ 
            return (
          <div className="example" key={index}> 
            <h3>Example{index+1}</h3> 
            <p>input:{example.input}</p> 
            <p>output: {example.output}</p> 
          </div> 
            )
        })}
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
    <div className="input-section">
    <h3>Custom Input</h3>

    <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your input..."
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
<div className="input-section">
    <h3>Target</h3>

    <input
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder="Enter target..."
    />
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
    )}
export default ProblemDetail;

import { useParams } from "react-router-dom"; 
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
    <pre>
        <code>
            {codeLines.map((line, index) => {
                return (
                    <span className="code-line" key={index}>
                        <span className="line-number">
                            {index + 1}
                        </span>

                        <span className="line-code">
                            {line}
                        </span>
                    </span>
                );
            })}
        </code>
    </pre>
</div> 
               
 
 
                     
</div> 
    </div> 
)}
export default ProblemDetail;
const { spawn } = require("child_process");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.post("/run", (req, res) => {
   const { code, testCases} = req.body;
    console.log(code);
    console.log(testCases);
    console.log("RUN API HIT");
    fs.writeFileSync(__dirname + "/Solution.java", code);

const javaProcess = spawn("java", ["Solution"]);
const testCase = testCases[0];
const input = testCase.input.join(" ");
const target = testCase.target;
javaProcess.stdin.write(input + "\n");
javaProcess.stdin.write(target + "\n");
javaProcess.stdin.end();
let output = "";
javaProcess.stdout.on("data", (data) => {
    output += data.toString();
});

 javaProcess.stderr.on("data",(data) => {
    output += data.toString();
});

javaProcess.on("close", (code) => {
    res.json({
        output: output,
})
});
app.listen(5000, () => {
    console.log("Server running on port 5000");
},)},
);
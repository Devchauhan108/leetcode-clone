const { spawn ,exec} = require("child_process");
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
exec("javac Solution.java", (error, stdout, stderr) => {
    if (error) {
        res.json({
            output: stderr
        });
        return;
    }
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
});
},)
app.post("/submit", async (req, res) => {

    const { code, testCases } = req.body;

    console.log("SUBMIT API HIT");
    console.log(code);
    console.log(testCases);

    fs.writeFileSync(__dirname + "/Solution.java", code);

    exec("javac Solution.java", async (error, stdout, stderr) => {

        if (error) {
            res.json({
                status: "Compilation Error",
                output: stderr
            });
            return;
        }

        console.log("Compilation successful");

        let results = [];
        let allPassed = true;

        for (let i = 0; i < testCases.length; i++) {

            const testCase = testCases[i];

            const javaProcess = spawn("java", ["Solution"]);

            const input = testCase.input.join(" ");
            const target = testCase.target;

            let output = "";

            javaProcess.stdin.write(input + "\n");
            javaProcess.stdin.write(target + "\n");
            javaProcess.stdin.end();

            javaProcess.stdout.on("data", (data) => {
                output += data.toString();
            });

            javaProcess.stderr.on("data", (data) => {
                output += data.toString();
            });

            await new Promise((resolve) => {

                javaProcess.on("close", () => {

                    output = output.trim();

                    const expected = String(testCase.output).trim();

                    const passed = output === expected;

                    results.push({
                        testCase: i + 1,
                        input: testCase.input,
                        expected: expected,
                        actual: output,
                        passed: passed
                    });

                    if (!passed) {
                        allPassed = false;
                    }

                    resolve();
                });
            });
        }
        res.json({
            status: allPassed ? "Accepted" : "Wrong Answer",
            results: results
        });
    });
});       
app.listen(5000, () => {
    console.log("Server running on port 5000");
})
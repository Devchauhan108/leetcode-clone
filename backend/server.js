const { spawn, exec } = require("child_process");
const fs = require("fs");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
function createMainCode(testCase) {
    const nums = testCase.input.join(", ");
    const target = testCase.target;

    return `
import java.util.*;

class Main {

    public static void main(String[] args) {

        Solution solution = new Solution();

        int[] nums = {${nums}};
        int target = ${target};

        int[] result = solution.twoSum(nums, target);

        System.out.println(Arrays.toString(result));
    }
}
`;
}
function compileSolution() {
    return new Promise((resolve, reject) => {
        exec("javac Solution.java", (error, stdout, stderr) => {
            if (error) {
                reject(stderr);
                return;
            }
            resolve();
        });
    });
}

function runJavaMain() {
    return new Promise((resolve, reject) => {
        exec("javac Main.java", (error, stdout, stderr) => {
            if (error) {
                reject({
                    type: "Compilation Error",
                    message: stderr
                });
                return;
            }
            const javaProcess = spawn("java", ["Main"]);
            let output = "";
            let runtimeError = "";
            javaProcess.stdout.on("data", (data) => {
                output += data.toString();
            });
            javaProcess.stderr.on("data", (data) => {
                runtimeError += data.toString();
            });
            javaProcess.on("close", (code) => {
                if (runtimeError) {
                    reject({
                        type: "Runtime Error",
                        message: runtimeError
                    });
                    return;
                }
                resolve(output.trim());
            });

        });
    });
}
app.post("/run", async (req, res) => {
    const { code, testCases } = req.body;
    console.log("RUN API HIT");
    try {
        fs.writeFileSync(
            __dirname + "/Solution.java",
            code
        );
        await compileSolution();
        const testCase = testCases[0];
        const mainCode = createMainCode(testCase);
        fs.writeFileSync(
            __dirname + "/Main.java",
            mainCode
        );
        const output = await runJavaMain();
        res.json({
            status: "Executed",
            output: output
        });
    } catch (error) {
        console.log("RUN ERROR:", error);
        if (error.type) {
            res.json({
               status: error.type,
                output: error.message
            });

        } else {

            res.json({
                status: "Compilation Error",
                output: error
            });
        }
    }
});function normalizeOutput(output) {
    return String(output)
        .trim()
        .replace(/\s+/g, "");
}
app.post("/submit", async (req, res) => {
    const { code, testCases } = req.body;
    console.log("SUBMIT API HIT");
    try {
        fs.writeFileSync(
            __dirname + "/Solution.java",
            code
        );
        await compileSolution();
        console.log("Compilation successful");
        let results = [];
        let allPassed = true;
        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];
            const mainCode = createMainCode(testCase);
            fs.writeFileSync(
                __dirname + "/Main.java",
                mainCode
            );
            let output;
            try {
                output = await runJavaMain();
            } catch (error) {
                results.push({
                    testCase: i + 1,
                    input: testCase.input,
                    expected: String(testCase.output).trim(),
                    actual: error.message,
                    passed: false
                });
                allPassed = false;
                break;
            }
         const expected = normalizeOutput(
    JSON.stringify(testCase.expected)
        );

        const actual = normalizeOutput(output);

        const passed = actual === expected;
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
        }
        res.json({
            status: allPassed
                ? "Accepted"
                : "Wrong Answer",
            results: results
        });
    } catch (error) {
        res.json({
            status: "Compilation Error",
            output: error
        });
    }
});
app.listen(5000, () => {
    console.log(
        "Server running on port 5000"
    );
});
const { spawn, exec } = require("child_process");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.post("/run", (req, res) => {
    const { code, testCases } = req.body;
    console.log("RUN API HIT");
    console.log(code);
    console.log(testCases);
    fs.writeFileSync(
        __dirname + "/Solution.java",
        code
    );
    exec(
        "javac Solution.java",
        (error, stdout, stderr) => {
            if (error) {
                res.json({
                    output: stderr
                });
                return;
            }
            const testCase = testCases[0];
            const nums = testCase.input.join(", ");
            const target = testCase.target;
            const mainCode = `
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
            fs.writeFileSync(
                __dirname + "/Main.java",
                mainCode
            );
            exec(
                "javac Main.java",
                (error, stdout, stderr) => {
                    if (error) {
                        res.json({
                            output: stderr
                        });
                        return;
                    }
                    const javaProcess =
                        spawn("java", ["Main"]);
                    let output = "";
                    javaProcess.stdout.on(
                        "data",
                        (data) => {
                            output += data.toString();
                        }
                    );
                    javaProcess.stderr.on(
                        "data",
                        (data) => {
                            output += data.toString();
                        }
                    );
                    javaProcess.on(
                        "close",
                        () => {

                            res.json({
                                output: output.trim()
                            });

                        }
                    );

                }
            );
        }
    );
});
app.post("/submit", async (req, res) => {
    const { code, testCases } = req.body;
    console.log("SUBMIT API HIT");
    console.log(code);
    console.log(testCases);

    fs.writeFileSync(
        __dirname + "/Solution.java",
        code
    );
    exec(
        "javac Solution.java",
        async (error, stdout, stderr) => {

            if (error) {
                res.json({
                    status: "Compilation Error",
                    output: stderr
                });
                return;
            }
            console.log(
                "Solution compilation successful"
            );
            let results = [];
            let allPassed = true;

            for (
                let i = 0;
                i < testCases.length;
                i++
            ) {
                const testCase = testCases[i];
                console.log(
                    `Running Test Case ${i + 1}`
                );
                const nums =
                    testCase.input.join(", ");

                const target =
                    testCase.target;

                const mainCode = `
import java.util.*;
class Main {
    public static void main(String[] args) {
        Solution solution = new Solution();
        int[] nums = {${nums}};
        int target = ${target};
        int[] result =
            solution.twoSum(nums, target);
        System.out.println(
            Arrays.toString(result)
        );
    }
}
`;
                fs.writeFileSync(
                    __dirname + "/Main.java",
                    mainCode
                );

                const output =
                    await runJavaMain();
                const expected =
                    String(testCase.output).trim();
                const passed =
                    output === expected;
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

                status:
                    allPassed
                        ? "Accepted"
                        : "Wrong Answer",
                results: results
            });
        }
    );
});
function runJavaMain() {
    return new Promise(
        (resolve, reject) => {
            exec(
                "javac Main.java",
                (error, stdout, stderr) => {
                    if (error) {
                        reject(stderr);
                        return;
                    }
                    console.log(
                        "Main compilation successful"
                    );
                    const javaProcess =
                        spawn(
                            "java",
                            ["Main"]
                        );
                    let output = "";

                    javaProcess.stdout.on(
                        "data",
                        (data) => {
                            output +=
                                data.toString();
                        }
                    );
                    javaProcess.stderr.on(
                        "data",
                        (data) => {
                            output +=
                                data.toString();
                        }
                    );
                    javaProcess.on(
                        "close",
                        () => {
                            resolve(
                                output.trim()
                            );
                        }
                    );
                }
            );
        }
    );
}
app.listen(5000, () => {

    console.log(
        "Server running on port 5000"
    );

});

const problems =[{
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    acceptance: "45.3%",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
        {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]"
        }
    ],
    constraints: [
        "2 <= nums.length <= 10^4",
        "-10^9 <= nums[i] <= 10^9",
        "-10^9 <= target <= 10^9"
    ],
    testCases: [
    {
        input: [2, 7, 11, 15],
        target: 9,
        expected: [0, 1]
    },
    {
        input: [3, 2, 4],
        target: 6,
        expected: [1, 2]
    }
]
},
{
    id:2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    acceptance: "31.2%"
},
{
    id:3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    acceptance: "29.5%"
},
{
    id:4,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    acceptance: "27.1%"
},
{
    id:5,
    title:"3sum",
    difficulty:"Medium",
    acceptance:"50.8%",
},
]
export default problems;
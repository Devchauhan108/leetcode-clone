import { Routes, Route } from "react-router-dom";
import Problems from "./pages/Problems/Problems";
import ProblemDetail from "./pages/ProblemDetail/ProblemDetail";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Problems />} />
            <Route path="/problems" element={<Problems />} />
            <Route
                path="/problem/:id"
                element={<ProblemDetail />}
            />
        </Routes>
    );
}
export default App;
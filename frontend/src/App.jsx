import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../src/pages/HomePage.jsx";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

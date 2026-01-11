import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Analysis from "../pages/Analysis";
import PageLayout from "../layout/PageLayout";

function App() {
  return (
    <Router>
      <PageLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analysis" element={<Analysis />} />
        </Routes>
      </PageLayout>
    </Router>
  );
}

export default App;

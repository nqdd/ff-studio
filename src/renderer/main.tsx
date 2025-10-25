import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.css';

function Hello() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <h1>FF Studio</h1>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}

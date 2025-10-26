import './styles/global.css';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { FileUpload } from './components/file-upload';

function Hello() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <FileUpload />
      </div>
    </main>
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

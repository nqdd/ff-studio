import './styles/global.css';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { FileUpload } from './components/file-upload';
import { ConversionQueue } from './components/conversion-queue';
import { ConversionSettings } from './components/conversion-settings';

function Hello() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <FileUpload />
            <ConversionSettings />
          </div>
          <div className="lg:col-span-1">
            <ConversionQueue />
          </div>
        </div>
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

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DailyReview from './pages/DailyReview';
import Investment from './pages/Investment';
import Reading from './pages/Reading';
import Reflections from './pages/Reflections';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/daily-review" element={<DailyReview />} />
        <Route path="/investment" element={<Investment />} />
        <Route path="/reading" element={<Reading />} />
        <Route path="/reflections" element={<Reflections />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

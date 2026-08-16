import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Booking } from './pages/Booking';
import { Admin } from './pages/Admin';
import { Toaster } from 'react-hot-toast';
import { ScrollToHash } from './components/ScrollToHash';
import { AiChatBot } from './components/AiChatBot';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-sans text-gray-900">
        <ScrollToHash />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book" element={<Booking />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
        <AiChatBot />
        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
}

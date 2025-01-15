import Home from './pages/home';
import AboutUs from './pages/aboutUs';
import Events from './pages/events';
import FaQs from './pages/faq';
import News from './pages/news';
import Error from './pages/error';
import AdminRoutes from './admin/routes/AdminRoutes';
import './App.css';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events/>} />
        <Route path="/faqs" element={<FaQs/>} />
        <Route path="/news" element={<News/>} />
        <Route path="/aboutus" element={<AboutUs/>} />
        
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        
        {/* 404 Route */}
        <Route path='*' element={<Error/>}/>
      </Routes>
    </>
  );
}

export default App;

import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Events from './pages/events';
import News from './pages/news';
import AboutUs from './pages/aboutUs';
import Error from './pages/error';
import FaQs from './pages/faq';
import Article from "./pages/article";
import AdminRoutes from './admin/routes/AdminRoutes';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/events" element={<Events/>} />
        <Route path="/faqs" element={<FaQs/>} />
        <Route path="/news" element={<News/>} />
        <Route path="/aboutus" element={<AboutUs/>} />
        <Route path="/news/article/:id" element={<Article />} />
        
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        
        {/* 404 Route */}
        <Route path='*' element={<Error/>}/>
      </Routes>
    </div>
  );
}

export default App;

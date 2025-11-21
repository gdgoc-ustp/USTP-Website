import './App.css';
import { Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/home';
import Events from './pages/events';
import News from './pages/news';
import AboutUs from './pages/aboutUs';
import MeetTheTeam from './pages/meetTheTeam';
import Error from './pages/error';
import FaQs from './pages/faq';
import Article from "./pages/article";
import PersonalityTest from "./pages/personalityTest";
import PersonalityQuestionnaire from "./pages/personalityQuestionnaire";
import PersonalityCodeInput from "./pages/personalityCodeInput";
import AdminRoutes from './admin/routes/AdminRoutes';
import Policy  from './pages/policy';
import Terms from './pages/terms';
import Sitemap from './pages/sitemap';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time or wait for resources
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/events" element={<Events/>} />
        <Route path="/faqs" element={<FaQs/>} />
        <Route path="/news" element={<News/>} />
        <Route path="/about-us" element={<AboutUs/>} />
        <Route path="/team" element={<MeetTheTeam/>} />
        <Route path="/news/article/:id" element={<Article />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/sitemap" element={<Sitemap />} />

        {/* Personality Test Routes */} 
        <Route path="/personality-test" element={<PersonalityQuestionnaire />} />
        <Route path="/personality-test/code" element={<PersonalityCodeInput />} />
        <Route path="/personality-test/:id" element={<PersonalityTest />} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* 404 Route */}
        <Route path='*' element={<Error/>}/>
      </Routes>
    </div>
  );
}

export default App;

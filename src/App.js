import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Events from './pages/events';
import News from './pages/news';
import AboutUs from './pages/aboutUs';
import Error from './pages/error';
import FaQs from './pages/faq';
import Article from "./pages/article";
import PersonalityTest from "./pages/personalityTest";
import PersonalityQuestionnaire from "./pages/personalityQuestionnaire";
import PersonalityCodeInput from "./pages/personalityCodeInput";
import AdminRoutes from './admin/routes/AdminRoutes';
import Policy  from './pages/policy';
import Terms from './pages/terms';

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
        <Route path="/policy" element={<Policy />} />
        <Route path="/terms" element={<Terms />} />

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

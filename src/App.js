import { initConsoleEasterEgg } from './lib/consoleEasterEgg';

// ... imports

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Console Easter Egg
    initConsoleEasterEgg();

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
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/faqs" element={<FaQs />} />
        <Route path="/news" element={<News />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/team" element={<MeetTheTeam />} />
        <Route path="/news/article/:id" element={<Article />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/sitemap" element={<Sitemap />} />
        <Route path="/register" element={<Register />} />



        {/* Personality Test Routes */}
        <Route path="/personality-test" element={<PersonalityQuestionnaire />} />
        <Route path="/personality-test/code" element={<PersonalityCodeInput />} />
        <Route path="/personality-test/:id" element={<PersonalityTest />} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* 404 Route */}
        <Route path='*' element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;

import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import Lawyer from './components/Lawyers';
import LawyerImageUpload from './pages/LawyerImageUpload';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Kakao from './components/Kakao';
import Gradio from './components/gradio';
import CommunityBoard from './pages/CommunityBoard';
import Community from './components/community';
import KakaoRedirectPage from './pages/KakaoLoginRedirect';
import EducationVideo from './pages/Educationvideo';
import Quiz from './pages/Quiz';
import QuizInfo from './pages/QuizInfo';


function Home() {
  return (
    <>
      <Header />
      <main className="main">
        <Hero />
        <Features />
        <Kakao />
        <Lawyer />
        <Gradio />
        <Community />
      </main>
      <Footer />
    </>
  );
}


function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz/>}/>
          <Route path="/video" element={<EducationVideo/>}/>
          <Route path="/quiz/info" element={<QuizInfo/>}/>
          <Route path="/lawyer-verification" element={<LawyerImageUpload />} />
          <Route path="/community" element={<CommunityBoard />} />
          <Route path="/kakao/callback" element={<KakaoRedirectPage />} />

        </Routes>
      </Router>
    </div>
  );
}


export default App;


import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import Lawyer from './components/Lawyers';
import LawyerImageUpload from './pages/LawyerImageUpload';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

      {/* 모바일 기본 → 데스크톱 확장 / X축 깨짐 방지 */}
      <main
        className="
          flex-1
          overflow-x-hidden
          py-8 sm:py-12
          px-4 sm:px-6 lg:px-8
        "
      >
        {/* 컴포넌트 간 간격 통일 (모바일/데스크톱 구간 차등) */}
        <div className="space-y-10 sm:space-y-14 lg:space-y-20 max-w-screen-xl mx-auto">
          <Hero />
          <Features />
          <Kakao />
          <Lawyer />
          <Gradio />
          <Community />
        </div>
      </main>

      <Footer />
    </>
  );
}

function App() {
  return (
    // 화면 높이 채우고 Footer를 하단에 고정되듯 밀어내기
    <div className="min-h-dvh flex flex-col bg-white text-gray-900">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/video" element={<EducationVideo />} />
          <Route path="/quiz/info" element={<QuizInfo />} />
          <Route path="/lawyer-verification" element={<LawyerImageUpload />} />
          <Route path="/community" element={<CommunityBoard />} />
          <Route path="/kakao/callback" element={<KakaoRedirectPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

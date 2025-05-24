import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import CTA from './components/CTA';
import Footer from './components/Footer';
import Lawyer from './components/Lawyers';
import LawyerImageUpload from './pages/LawyerImageUpload';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';

function Home(){
  return (
    <>
      <Header />
      <main className="main-content">
        <Hero />
        <Features />
        <Lawyer/>
        <CTA />
      </main>
      <Footer />
    </>
  );

}


function App() {
  return (
    <div className="font-pretendard bg-red-200">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lawyer-verification" element={<LawyerImageUpload/>} />
        </Routes>
      </Router>
    </div>
  );
}


export default App;


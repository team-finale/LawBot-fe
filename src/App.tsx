import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import CTA from './components/CTA';
import Footer from './components/Footer';



function App() {
  return (
    <div className="font-pretendard bg-red-200">
      <Header />
      <main className="main-content">
        <Hero />
        <Features />
        <CTA />
      </main>
      <Footer />
      
    </div>
  );
}

export default App;


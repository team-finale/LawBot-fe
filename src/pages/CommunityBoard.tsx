import Header from "../components/Header";
import Footer from "../components/Footer";

const CommunityBoard = () => {
  return ( <div className="page-wrapper">
          <div className="header-fixed">
            <Header />
          </div>

        
        <main className="page-content">
          <h2>커뮤니티에 오신 것을 환영합니다!</h2>
          <p>여기는 향후 커뮤니티 게시글이 표시될 공간입니다.</p>
        </main>


           <Footer/>
        </div>

);
};


export default CommunityBoard;

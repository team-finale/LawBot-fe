import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import "./CommunityBoard.css";

const CommunityBoard = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState(""); // ✅ 하나의 태그만 선택

  const handleCreatePost = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await axios.post(
        "https://2lawon.com/api/community",
        {
          title,
          content,
          tags: tag ? [tag] : [], // ✅ 하나의 태그를 배열로 전송
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("게시글이 등록되었습니다!");
      setTitle("");
      setContent("");
      setTag("");
    } catch (error: any) {
      alert("등록 실패: " + (error.response?.data?.detail || error.message));
    }
  };

  return (
    <div className="page-wrapper">
      <div className="header-fixed">
        <Header />
      </div>

      <main className="page-content">
        <h2 className="community-title">커뮤니티 게시글 작성</h2>
        <form
          className="community-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleCreatePost();
          }}
        >
          <label>
            제목
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>

          <label>
            내용
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </label>

          <label>
            태그 선택
            <select value={tag} onChange={(e) => setTag(e.target.value)} required>
              <option value="">-- 태그를 선택하세요 --</option>
              <option value="unfair_dismissal">부당해고</option>
              <option value="industrial_accident">산업재해</option>
              <option value="wage_arrears">임금체불</option>
              <option value="sexual_harassment">성희롱</option>
              <option value="labor_union">노동조합</option>
            </select>
          </label>

          <button type="submit">게시글 등록</button>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default CommunityBoard;

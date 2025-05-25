import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import "./CommunityBoard.css"; // ✅ 이 파일에 CSS 추가

const CommunityBoard = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const handleCreatePost = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const tagList = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      const res = await axios.post(
        "http://2lawon.com:8000/api/community",
        { title, content, tags: tagList },
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
      setTags("");
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
            태그 (쉼표로 구분)
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </label>

          <button type="submit">게시글 등록</button>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default CommunityBoard;

// src/pages/LawyerImageUpload.tsx
import React, { useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import Footer from "../components/Footer";
import "./LawyerImageUpload.css";

const LawyerImageUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("https://2lawon.com/api/users/cpla/image/save", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      const url = res.data.profile_image_url;
      alert("업로드 성공: " + res.data.profile_image_url);
      setUploadedUrl(url);

    } catch (err: any) {
      console.error("업로드 실패", err.response?.data || err.message);
      alert("업로드 실패: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="page-wrapper">
      <div className="header-fixed">
        <Header />
      </div>

      <main className="page-content">
        <div className="upload-container">
          <h2>노무사 인증을 진행해주세요(로그인 먼저)</h2>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button onClick={handleUpload}>이미지 업로드하기</button>

          {uploadedUrl && (
            <div className="preview">
              <h3>업로드된 이미지 미리보기</h3>
              <img src={uploadedUrl} alt="업로드 이미지" />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LawyerImageUpload;

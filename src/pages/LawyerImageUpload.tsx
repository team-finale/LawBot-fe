// src/pages/LawyerImageUpload.tsx
import React, { useState } from "react";
import Header from "../components/Header";
import axios from "axios";

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
      const res = await axios.post("http://2lawon.com:8000/api/users/lawyer/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          //Authorization: `Bearer ${localStorage.getItem("access_token")}`,
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
    <div>
    <Header/>
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">노무사 인증</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        이미지 업로드하기
      </button>

     {/* ✅ 업로드 성공 시 이미지 미리보기 */}
        {uploadedUrl && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">업로드된 이미지 미리보기</h3>
            <img
              src={uploadedUrl}
              alt="업로드 파일 미리보기"
              className="w-64 h-auto rounded shadow-md border"
            />
          </div>
      )}


    </div>
    </div>
  );
};

export default LawyerImageUpload;

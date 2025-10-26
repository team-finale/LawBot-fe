// src/pages/Consult.tsx
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useMemo } from "react";
import "./consult.css";

export default function Consult() {
  // Gradio UI의 경로 설정: /gradio 경로에서 FastAPI가 Gradio UI를 서빙한다고 가정
  const gradioSrc = useMemo(() => `${window.location.origin}/gradio`, []);

  return (
    <div className="page-wrapper">
      <Header /> {/* 기존 Header 유지 */}

      <main className="consult-main">
        <section className="gradio-section">
          <h1 className="gradio-title">이로운에게 물어보세요</h1>
          <p className="gradio-subtitle">LLM+RAG 기반 챗봇이 빠르고 쉽게 알려드릴게요</p>
          <div className="gradio-frame-wrap">
            {/* Gradio UI를 iframe으로 삽입 */}
            <iframe
              className="gradio-frame"
              src={gradioSrc}
              title="Iroun Gradio"
              allow="clipboard-read; clipboard-write; microphone; camera"
              sandbox="allow-forms allow-scripts allow-same-origin allow-downloads"
            />
          </div>
        </section>
      </main>

      <Footer /> {/* 기존 Footer 유지 */}
    </div>
  );
}

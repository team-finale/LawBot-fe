import "./Features.css";

export default function Features() {
  return (
    <section className="alt-sections">

      {/* 섹션 1 - 텍스트 왼쪽 */}
      <div className="alt-row">
        <div className="alt-text">
          <p className="alt-subtitle">😊 노동권 보호</p>
          <h2 className="alt-title">실시간으로 쉽게<br />접근할 수 있는 이로운</h2>
          <p className="alt-description">
            취약 노동자들이 실시간으로 권리 침해를 파악하고,<br />
            후속 절차를 안내받을 수 있는 서비스 제공
          </p>
        </div>
      </div>

      {/* 섹션 2 - 텍스트 오른쪽 */}
      <div className="alt-row reverse">
        <div className="alt-text">
          <p className="alt-subtitle">🔥 사회적 분쟁 비용 절감</p>
          <h2 className="alt-title">분쟁 예방을 통한 <br />사회적 갈등 비용 절감의 이로운</h2>
          <p className="alt-description">
            실시간 법률 상담을 통한 문제 해결을 통해,<br />
            고용노동 민원의 1차 사전 해결율 제고<br />
          </p>
        </div>
      </div>

       <div className="alt-row">
        <div className="alt-text">
          <p className="alt-subtitle">✨ 법률 접근성 향상</p>
          <h2 className="alt-title">복잡한 노동 법률 절차에 대한 <br />부담을 줄이는 이로운</h2>
          <p className="alt-description">
            법률 퀴즈를 통해,<br />
            노동자가 어렵게 느끼는 법적 개념을<br/>
            쉽고 재밌게 익히는 서비스 제공
          </p>
        </div>
      </div>

      
      <div className="alt-row reverse center-text">
        
          
          <h2 className="alt-title">"사용자의 고용노동 문제를 실시간으로 정확하게 파악하고, 누구나 쉽게 접근해, <br/>권리 보호와 문제 해결을 자동화하는 플랫폼" </h2>
          
        
      </div>

    </section>
  );
}

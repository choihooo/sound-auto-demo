import { useFunnel } from "@use-funnel/react-router-dom";
import { useEffect, useRef, useCallback } from "react";
import "./App.css";
import track1 from "./tracks/track1.mp3";
import track2 from "./tracks/track2.mp3";
import track3 from "./tracks/track3.mp3";

type 전화1 = {};
// 2. 이메일은 입력됨
type 전화2 = {};
// 3. 이메일과 비밀번호 입력됨
type 전화3 = {};

type FunnelStep = "전화1" | "전화2" | "전화3";

// 각 단계별 음악 트랙 매핑
const STEP_TRACKS: Record<FunnelStep, string> = {
  전화1: track1, // 전화1 단계 음악
  전화2: track2, // 전화2 단계 음악
  전화3: track3, // 전화3 단계 음악
};

function App() {
  const funnel = useFunnel<{
    전화1: 전화1;
    전화2: 전화2;
    전화3: 전화3;
  }>({
    id: "my-funnel-app",
    initial: {
      step: "전화1",
      context: {},
    },
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 음악 트랙 변경 함수
  const changeTrack = useCallback((step: FunnelStep) => {
    const trackUrl = STEP_TRACKS[step];

    if (!trackUrl) return;

    if (!audioRef.current) {
      // audio 엘리먼트가 없으면 생성
      const audio = new Audio(trackUrl);
      audio.loop = true;
      audioRef.current = audio;
      audio.play().catch((error) => {
        console.error("음악 재생 실패:", error);
      });
    } else {
      audioRef.current.pause();
      audioRef.current.src = trackUrl;
      audioRef.current.load();
      audioRef.current.play().catch((error) => {
        console.error("음악 재생 실패:", error);
      });
    }
  }, []);

  return (
    <>
      <audio ref={audioRef} />
      <funnel.Render
        전화1={({ history }) => (
          <전화1
            onNext={() => history.push("전화2", {})}
            onChangeTrack={() => changeTrack("전화1")}
          />
        )}
        전화2={({ history }) => (
          <전화2
            onNext={() => history.push("전화3", {})}
            onChangeTrack={() => changeTrack("전화2")}
          />
        )}
        전화3={() => <전화3 onChangeTrack={() => changeTrack("전화3")} />}
      ></funnel.Render>
    </>
  );
}

// 전화1 컴포넌트
function 전화1({
  onNext,
  onChangeTrack,
}: {
  onNext: () => void;
  onChangeTrack: () => void;
}) {
  const handlePlay = () => {
    onChangeTrack();
  };

  return (
    <div>
      <h1>전화1 단계</h1>
      <button onClick={handlePlay}>재생</button>
      <button onClick={onNext}>다음</button>
    </div>
  );
}

// 전화2 컴포넌트
function 전화2({
  onNext,
  onChangeTrack,
}: {
  onNext: () => void;
  onChangeTrack: () => void;
}) {
  useEffect(() => {
    onChangeTrack();
  }, [onChangeTrack]);

  return (
    <div>
      <h1>전화2 단계</h1>
      <button onClick={onNext}>다음</button>
    </div>
  );
}

// 전화3 컴포넌트
function 전화3({ onChangeTrack }: { onChangeTrack: () => void }) {
  useEffect(() => {
    onChangeTrack();
  }, [onChangeTrack]);

  return (
    <div>
      <h1>전화3 단계</h1>
    </div>
  );
}

export default App;

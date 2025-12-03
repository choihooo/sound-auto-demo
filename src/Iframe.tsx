import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useCallback } from "react";
import track1 from "./tracks/track1.mp3";
import track2 from "./tracks/track2.mp3";
import track3 from "./tracks/track3.mp3";

type IframeStep = "1" | "2" | "3";

// 각 단계별 음악 트랙 매핑
const STEP_TRACKS: Record<IframeStep, string> = {
  "1": track1, // 1단계 음악
  "2": track2, // 2단계 음악
  "3": track3, // 3단계 음악
};

function IframeStep1({
  navigate,
  onChangeTrack,
}: {
  navigate: () => void;
  onChangeTrack: () => void;
}) {
  useEffect(() => {
    onChangeTrack();
  }, [onChangeTrack]);

  return (
    <div>
      <h1>Iframe 1단계</h1>
      <button onClick={navigate}>다음</button>
    </div>
  );
}

function IframeStep2({
  navigate,
  onChangeTrack,
}: {
  navigate: () => void;
  onChangeTrack: () => void;
}) {
  useEffect(() => {
    onChangeTrack();
  }, [onChangeTrack]);

  return (
    <div>
      <h1>Iframe 2단계</h1>
      <button onClick={navigate}>다음</button>
    </div>
  );
}

function IframeStep3({ onChangeTrack }: { onChangeTrack: () => void }) {
  useEffect(() => {
    onChangeTrack();
  }, [onChangeTrack]);

  return (
    <div>
      <h1>Iframe 3단계</h1>
    </div>
  );
}

function Iframe() {
  const location = useLocation();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 음악 트랙 변경 함수
  const changeTrack = useCallback((step: IframeStep) => {
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
      // 기존 음악 정지 후 새 트랙으로 변경
      audioRef.current.pause();
      audioRef.current.src = trackUrl;
      audioRef.current.load();
      audioRef.current.play().catch((error) => {
        console.error("음악 재생 실패:", error);
      });
    }
  }, []);

  // /iframe으로 직접 접근하면 /iframe/1로 리다이렉트
  if (location.pathname === "/iframe") {
    navigate("/iframe/1", { replace: true });
    return null;
  }

  return (
    <>
      <audio ref={audioRef} />
      <Routes>
        <Route
          path="1"
          element={
            <IframeStep1
              navigate={() => navigate("/iframe/2")}
              onChangeTrack={() => changeTrack("1")}
            />
          }
        />
        <Route
          path="2"
          element={
            <IframeStep2
              navigate={() => navigate("/iframe/3")}
              onChangeTrack={() => changeTrack("2")}
            />
          }
        />
        <Route
          path="3"
          element={<IframeStep3 onChangeTrack={() => changeTrack("3")} />}
        />
      </Routes>
    </>
  );
}

export default Iframe;

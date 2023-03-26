import React, { useState, useRef } from "react";

const AudioRecorder = () => {
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);

  const handleStartRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        const audioChunks = [];

        mediaRecorder.addEventListener("dataavailable", (event) => {
          audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          setAudioBlob(audioBlob);
          setAudioDuration(audioRef.current.duration);
        });

        mediaRecorder.start();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current.stop();
  };

  const handlePlayAudio = () => {
    if (audioBlob) {
      const audioURL = URL.createObjectURL(audioBlob);
      audioRef.current.src = audioURL;
      audioRef.current.play();
    }
  };

  return (
    <div>
      <button onClick={handleStartRecording}>Start Recording</button>
      <button onClick={handleStopRecording}>Stop Recording</button>
      <button onClick={handlePlayAudio}>Play Audio</button>
      <audio ref={audioRef} onLoadedMetadata={() => setAudioDuration(audioRef.current.duration)} />
      <div
        style={{
          height: "20px",
          width: "100%",
          backgroundColor: "gray",
          position: "relative",
        }}
      >
        <div
          style={{
            height: "20px",
            width: `${(audioDuration / 60) * 100}%`,
            backgroundColor: "green",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      </div>
    </div>
  );
};

export default AudioRecorder;

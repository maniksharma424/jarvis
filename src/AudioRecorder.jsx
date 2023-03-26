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
          console.log(audioChunks);
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
      console.log(audioBlob);
      const audioURL = URL.createObjectURL(audioBlob);
      audioRef.current.src = audioURL;
      audioRef.current.play();
      transcribe(audioBlob);
    }
  };

  const transcribe = async (audioBlob) => {
    const apiUrl = "https://api.openai.com/v1/audio/transcriptions";
    const apiKey = "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";



    // create the request body
    const formData = new FormData();
    formData.append("file", audioBlob,"audio URL");
    formData.append("model", "whisper-1");
    console.log(formData);


    // make the API request using fetch
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    // read the response body as JSON
    const resp = await response.json();
    console.log(resp);
  };

  return (
    <div>
      <button onClick={handleStartRecording}>Start Recording</button>
      <button onClick={handleStopRecording}>Stop Recording</button>
      <button onClick={handlePlayAudio}>Play Audio</button>
      <audio
        ref={audioRef}
        onLoadedMetadata={() => setAudioDuration(audioRef.current.duration)}
      />
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

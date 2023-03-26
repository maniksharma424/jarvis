import React, { useState, useEffect, useRef } from "react";
import { createWorker } from "mediasoup-client";
import { encode } from "base64-arraybuffer";

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioSrc, setAudioSrc] = useState("");
  const [mediaStream, setMediaStream] = useState(null);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    async function startRecording() {
      try {
        const worker = await createWorker();
        await worker.load("https://mediasoup-demo.global.ssl.fastly.net/mediasoup-demo-app.js");
        await worker.start({ mediasoup: { logLevel: "warn" } });
        const router = await worker.createRouter({ mediaCodecs: [{ kind: "audio", mimeType: "audio/opus" }] });
        const audioTransport = await router.createWebRtcTransport({ listenIps: ["127.0.0.1"] });
        const audioProducer = await audioTransport.produce({ kind: "audio", rtpParameters: { codecs: [{ mimeType: "audio/opus" }] } });
        const mediaStream = new MediaStream();
        mediaStream.addTrack(audioProducer.track);
        const mediaRecorder = new MediaRecorder(mediaStream, { mimeType: "audio/mp3" });
        mediaRecorder.ondataavailable = (e) => {
          const reader = new FileReader();
          reader.readAsArrayBuffer(e.data);
          reader.onloadend = () => {
            const base64String = encode(reader.result);
            setAudioSrc(`data:audio/mp3;base64,${base64String}`);
          };
        };
        setMediaStream(mediaStream);
        mediaRecorderRef.current = mediaRecorder;
      } catch (error) {
        console.error(error);
      }
    }

    if (!mediaStream) {
      startRecording();
    }
  }, [mediaStream]);

  const handleRecordClick = () => {
    if (!recording) {
      mediaRecorderRef.current.start();
      setRecording(true);
    } else {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handlePlayClick = () => {
    const audioElement = document.getElementById("audio-element");
    audioElement.src = audioSrc;
    audioElement.play();
  };

  return (
    <div>
      <button onClick={handleRecordClick}>{recording ? "Stop Recording" : "Start Recording"}</button>
      <button onClick={handlePlayClick} disabled={!audioSrc}>
        Play Recording
      </button>
      <audio id="audio-element" controls />
    </div>
  );
};

export default AudioRecorder;

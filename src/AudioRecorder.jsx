import React, { useState, useRef } from "react";
import { Configuration } from "openai";
import { OpenAIApi } from "openai";
import { logDOM } from "@testing-library/react";
const configuration = new Configuration({
  apiKey: "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",
});
const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const mediaRecorderRef = useRef(null);

  const handleStartRecording = () => {
    setRecording(true);
    setAudioChunks([]);
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      mediaRecorder.addEventListener("dataavailable", (e) => {
        if (e.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, e.data]);
        }
      });
      mediaRecorder.addEventListener("stop", () => {
        setRecording(false);
      });
    });
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current.stop();
  };

  const handleDownload = () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
    const audioUrl = URL.createObjectURL(audioBlob);
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = "recording.webm";
    document.body.appendChild(link);
    link.click();
  };

  const handleUpload = async () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
    const model = "whisper-1";
    console.log(audioBlob);

    const formData = new FormData();
    formData.append("file", audioBlob);
    formData.append("model", model);

    // const formData = {
    //   file:audioBlob,
    //   model:"whisper-1"
    // }

    fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Content-Type": "audio/webm",
        Authorization: `Bearer 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`,

      },
      body:formData,
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
      console.log(formData);

    // const openai = new OpenAIApi(configuration);
    // const resp = await openai.createTranscription({formData});
    // console.log(resp);
  };
  const style = "border-[1px] border-black m-1 p-1 rounded-md";
  return (
    <div>
      <button
        className={style}
        onClick={handleStartRecording}
        disabled={recording}
      >
        {recording ? "Recording..." : "Record"}
      </button>
      <button
        className={style}
        onClick={handleStopRecording}
        disabled={!recording}
      >
        Stop
      </button>
      <button
        className={style}
        onClick={handleDownload}
        disabled={!audioChunks.length}
      >
        Download
      </button>
      <button
        className={style}
        onClick={handleUpload}
        disabled={!audioChunks.length}
      >
        Upload
      </button>
    </div>
  );
};

export default AudioRecorder;

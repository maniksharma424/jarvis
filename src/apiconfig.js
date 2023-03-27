const key= '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'


const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", audioFile);
    formData.append("model", "whisper-1");
    console.log(formData);

    // send the formData to the server using fetch or axios
    fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Content-Type": "audio/webm",
        Authorization: `Bearer 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`,
        
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };
import React, { useState, useEffect, useRef } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export function Meme() {
  const [meme, setMeme] = useState({
    topText: "",
    bottomText: "",
    imageUrl: "https://i.imgflip.com/1bij.jpg",
  });
  const [allMemes, setAllMemes] = useState([]);
  const canvasRef = useRef(null);

  // Fetch memes
  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then((res) => res.json())
      .then((data) => setAllMemes(data.data.memes));
  }, []);

  function handleOnChange(e) {
    const { name, value } = e.target;
    setMeme((prev) => ({ ...prev, [name]: value }));
  }

  function getMemeImage() {
    if (!allMemes.length) return;
    const index = Math.floor(Math.random() * allMemes.length);
    setMeme((prev) => ({ ...prev, imageUrl: allMemes[index].url }));
  }

  function drawMemeOnCanvas() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.crossOrigin = "anonymous"; // To avoid CORS issues
    image.src = meme.imageUrl;

    return new Promise((resolve) => {
      image.onload = () => {
        // Set canvas size to image size
        canvas.width = image.width;
        canvas.height = image.height;

        // Draw image
        ctx.drawImage(image, 0, 0);

        // Set text styles
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.textAlign = "center";
        ctx.font = `${Math.floor(canvas.width / 10)}px Impact`;
        ctx.textBaseline = "top";

        // Draw top text
        ctx.fillText(meme.topText.toUpperCase(), canvas.width / 2, 10);
        ctx.strokeText(meme.topText.toUpperCase(), canvas.width / 2, 10);

        // Draw bottom text
        ctx.textBaseline = "bottom";
        ctx.fillText(
          meme.bottomText.toUpperCase(),
          canvas.width / 2,
          canvas.height - 10
        );
        ctx.strokeText(
          meme.bottomText.toUpperCase(),
          canvas.width / 2,
          canvas.height - 10
        );

        resolve(canvas.toDataURL("image/png"));
      };
    });
  }

  async function uploadToImgur(dataUrl) {
    const CLIENT_ID = "YOUR_IMGUR_CLIENT_ID"; // Replace with your Imgur client ID
    const base64 = dataUrl.split(",")[1];

    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${CLIENT_ID}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: base64, type: "base64" }),
    });

    const data = await response.json();
    if (data.success) return data.data.link;
    throw new Error("Imgur upload failed");
  }

  async function shareMeme() {
    try {
      // Step 1 & 2: Draw on canvas and get PNG
      const memeDataUrl = await drawMemeOnCanvas();

      // Step 3: Upload to get public URL
      const memeUrl = await uploadToImgur(memeDataUrl);

      // Step 4: Share to Farcaster
      const result = await sdk.actions.composeCast({
        text: "Check out my meme! 🎉",
        embeds: [memeUrl],
      });

      if (result?.success) {
        alert("Meme shared to Farcaster!");
      }
    } catch (err) {
      console.error("Error sharing meme:", err);
      alert("Failed to share meme.");
    }
  }

  return (
    <main>
      <div className="form">
        <label>
          Top Text
          <textarea
            name="topText"
            value={meme.topText}
            onChange={handleOnChange}
            rows={2}
          />
        </label>

        <label>
          Bottom Text
          <textarea
            name="bottomText"
            value={meme.bottomText}
            onChange={handleOnChange}
            rows={2}
          />
        </label>

        <button onClick={getMemeImage}>New Meme Image 🖼️</button>
        <button onClick={shareMeme}>Share to Farcaster 🚀</button>
      </div>

      <div className="meme-preview">
        <canvas ref={canvasRef} style={{ maxWidth: "100%" }} />
      </div>
    </main>
  );
}

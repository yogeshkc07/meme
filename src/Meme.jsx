import React, { useState, useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export function Meme() {
  const [meme, setMeme] = useState({
    topText: "",
    bottomText: "",
    imageUrl: "https://i.imgflip.com/1bij.jpg",
  });

  const [allMemes, setAllMemes] = useState([]);

  useEffect(() => {
    // Fetch memes
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

  async function shareMeme() {
    try {
      const result = await sdk.actions.composeCast({
        text: `This meme was made using Meme Maker 🎉\n\n${meme.topText}\n${meme.bottomText}`,
        embeds: ["https://meme-sigma-five.vercel.app"], // This will create the mini app card preview
      });

      if (result?.success) {
        console.log("Cast composed successfully:", result);
      }
    } catch (err) {
      console.error("Error composing cast:", err);
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

      <div className="meme">
        <img src={meme.imageUrl} alt="Meme" />
        <span className="top">{meme.topText}</span>
        <span className="bottom">{meme.bottomText}</span>
      </div>
    </main>
  );
}

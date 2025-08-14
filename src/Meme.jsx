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
        text: `${meme.topText}\n${meme.bottomText}\n\nThis meme is made using Meme Maker 🎉\nTry it here: https://meme-sigma-five.vercel.app`,
        embeds: [meme.imageUrl],
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

      <div className="meme">
        <img src={meme.imageUrl} alt="Meme" />
        <span className="top">{meme.topText}</span>
        <span className="bottom">{meme.bottomText}</span>
      </div>
    </main>
  );
}

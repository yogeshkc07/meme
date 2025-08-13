import React, { useState, useEffect } from "react";

export function Meme() {
  const [meme, setMeme] = useState({
    topText: "One does not Simply",
    bottomText: "Walk into Mordor",
    imageUrl: "http://i.imgflip.com/1bij.jpg",
  });

  const [allMemes, setAllMemes] = useState([]);

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then((res) => res.json())
      .then((data) => setAllMemes(data.data.memes));
  }, []);

  function handleOnChange(event) {
    const { name, value } = event.currentTarget;
    setMeme((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      const { name, value } = event.currentTarget;
      setMeme((prev) => ({
        ...prev,
        [name]: value + "\n",
      }));
      event.preventDefault();
    }
  }

  function getMemeImage() {
    if (!allMemes.length) return;
    const index = Math.floor(Math.random() * allMemes.length);
    const newMemeUrl = allMemes[index].url;

    setMeme((prev) => ({
      ...prev,
      imageUrl: newMemeUrl,
    }));
  }

  return (
    <main>
      <div className="form">
        <label>
          Top Text
          <textarea
            placeholder="One does not simply"
            name="topText"
            value={meme.topText}
            onChange={handleOnChange}
            onKeyDown={handleKeyDown}
          />
        </label>

        <label>
          Bottom Text
          <textarea
            placeholder="Walk into Mordor"
            name="bottomText"
            value={meme.bottomText}
            onChange={handleOnChange}
            onKeyDown={handleKeyDown}
          />
        </label>

        <button onClick={getMemeImage}>Get a new meme image 🖼️</button>
      </div>

      <div className="meme">
        <img src={meme.imageUrl} alt="Meme" />
        <span className="top">{meme.topText}</span>
        <span className="bottom">{meme.bottomText}</span>
      </div>
    </main>
  );
}

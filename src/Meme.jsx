import React, { useState, useEffect } from 'react';

export function Meme() {
  const [meme, setMeme] = useState({
    topText: "One does not Simply",
    bottomText: "Walk into Mordor",
    imageUrl: "http://i.imgflip.com/1bij.jpg",
  });

  const [allMemes, setAllMemes] = useState([]);

  function handleOnChange(event) {
    const { value, name } = event.currentTarget;
    setMeme(prevMeme => ({
      ...prevMeme,
      [name]: value
    }));
  }

  useEffect(() => {
    fetch('https://api.imgflip.com/get_memes')
      .then(res => res.json())
      .then(data => setAllMemes(data.data.memes));
  }, []);

  function getMemeImage() {
    const index = Math.floor(Math.random() * allMemes.length);
    const newMemeUrl = allMemes[index].url;

    setMeme(prevMeme => ({
      ...prevMeme,
      imageUrl: newMemeUrl
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
            rows={2}
          />
        </label>

        <label>
          Bottom Text
          <textarea
            placeholder="Walk into Mordor"
            name="bottomText"
            value={meme.bottomText}
            onChange={handleOnChange}
            rows={2}
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

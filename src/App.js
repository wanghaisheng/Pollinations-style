import React, { useState } from 'react';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('blueprint of a robobee');
  const [style, setStyle] = useState('Ukiyo-e');
  const [ratio, setRatio] = useState('1:1');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const styles = [
    "Ukiyo-e", "Photorealism", "Hyperrealism", "Digital Art", "Abstract Expressionism", "Art Deco",
    "Art Nouveau", "Baroque", "Bauhaus", "Cubism", "Expressionism", "Fauvism",
    "Impressionism", "Minimalism", "Pop Art", "Renaissance", "Romanticism",
    "Surrealism", "Street Art"
  ];

  const ratios = [
    "1:1", "16:9", "3:2", "2:3", "9:16"
  ];

  const handleGenerateArt = async () => {
    setLoading(true);
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_cookie_token: 'YOUR_SESSION_TOKEN_HERE', prompt, style, ratio })
    });

    if (response.ok) {
      const data = await response.json();
      setImages(data.images || []);
    } else {
      console.error('Failed to generate images');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <header className="header">
        <div className="logo">
          <img src="https://pollinations.ai/p/colorful%20abstract%20flower%20logo%2C%20geometric%20shapes%2C%20vibrant%20colors%2C%20minimalist%20design?seed=14" alt="Pollinations.AI Logo" />
        </div>
        <h1>Pollinations.AI Image Imagine (Uncensored)</h1>
      </header>
      <div className="download-instructions">
        To download an image: Click on the image, then right-click and select "Open image in new tab", then save from there.
      </div>
      <div className="controls">
        <select value={style} onChange={(e) => setStyle(e.target.value)}>
          {styles.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div>
          <div className="prompt-sign">Enter your prompt:</div>
          <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        </div>
        <select value={ratio} onChange={(e) => setRatio(e.target.value)}>
          {ratios.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <button onClick={handleGenerateArt}>Generate Detailed Art</button>
      </div>
      <div className="gallery">
        {loading && <div id="loadingIndicator">Generating images...</div>}
        {images.map((img, idx) => (
          <div key={idx} className="art-piece">
            <img src={img.url} alt={img.prompt} onClick={() => openModal(img.url)} />
            <div className="art-info">
              <h3>{img.prompt}</h3>
              <p>Style: {img.style}</p>
              <p>Ratio: {img.ratio}</p>
              <p>Dimensions: {img.width}x{img.height}</p>
              <p>Seed: {img.seed}</p>
            </div>
            <div className="watermark">by jojo</div>
          </div>
        ))}
      </div>
      <div className="footer">
        <a href="https://pollinations.ai" target="_blank" rel="noopener noreferrer">Visit Pollinations.AI</a>
        <a href="https://discord.gg/k9F7SyTgqn" target="_blank" rel="noopener noreferrer">Join our Discord</a>
      </div>
      <div id="imageModal" className="modal">
        <span className="close" onClick={() => closeModal()}>×</span>
        <img className="modal-content" id="modalImage" src="" alt="" />
        <div className="watermark">by jojo</div>
      </div>
    </div>
  );
  
  function openModal(src) {
    document.getElementById('imageModal').style.display = 'block';
    document.getElementById('modalImage').src = src;
  }

  function closeModal() {
    document.getElementById('imageModal').style.display = 'none';
  }
}

export default App;

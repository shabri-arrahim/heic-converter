import { useState } from 'react';
import './styles.css';

export default function HeicConverter() {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('jpeg');
  const [width, setWidth] = useState(800);
  const [convertedImage, setConvertedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleFormatChange = (e) => setFormat(e.target.value);
  const handleWidthChange = (e) => setWidth(e.target.value);
  
  const handleConvert = async () => {
    if (!file) return alert('Please select a file.');

    setLoading(true); // Start loading
    setConvertedImage(null); // Clear previous image
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format);
    formData.append('width', width);
  
    try {
      const response = await fetch('http://heic-backend:8000/api/convert', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) throw new Error("Conversion failed");
  
      const blob = await response.blob();
      setConvertedImage(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to convert image.");
    } finally {
      setLoading(false); // Stop loading
    }
  };
  
  
  return (
    <div className="container">
      <h2>HEIC Image Converter</h2>
      <input type="file" accept="image/heic" onChange={handleFileChange} className="input-file" />
      <select value={format} onChange={handleFormatChange} className="select-format">
        <option value="jpeg">JPEG</option>
        <option value="png">PNG</option>
        <option value="webp">WebP</option>
      </select>
      <input type="number" value={width} onChange={handleWidthChange} className="input-width" />
      <button onClick={handleConvert} className="convert-button" disabled={loading}>
        {loading ? 'Processing...' : 'Convert'}
      </button>
      {loading && <p className="loading-text">Converting image, please wait...</p>}
      {convertedImage && (
        <div className="output-container">
          <h3>Converted Image:</h3>
          <img src={convertedImage} alt="Converted" className="output-image" />
        </div>
      )}
    </div>
  );
}

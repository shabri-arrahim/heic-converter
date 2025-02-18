import { useState } from 'react';
import { X } from "react-feather"; 

export default function HeicConverter() {
  const [files, setFiles] = useState([]);
  const [format, setFormat] = useState('jpeg');
  const [width, setWidth] = useState(800);
  const [convertedImages, setConvertedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const handleFileChange = (e) => setFiles(Array.from(e.target.files));
  const handleFormatChange = (e) => setFormat(e.target.value);
  const handleWidthChange = (e) => setWidth(e.target.value);
  const removeFile = (fileName) => {
    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  };
  
  const handleConvert = async () => {
    if (!files.length) return alert('Please select a file.');

    setLoading(true); // Start loading
    setConvertedImages([]); // Clear previous image
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('format', format);
    formData.append('width', width);

    const startTime = performance.now(); // Start time measurement
    try {
      const response = await fetch('/api/convert', {  // Use relative URL
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Conversion failed");

      const data = await response.json();
      setConvertedImages(Array.from(data.images));
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to convert image.");
    } finally {
      setLoading(false); // Stop loading
      const endTime = performance.now(); // End time measurement
      console.log(`Conversion process took ${(endTime - startTime) / 1000} seconds.`);
    }
  };
  
  
  return (
    <div className="container flex flex-col items-center justify-center h-screen w-screen bg-white">
      {/* Dropdown image section */}
      <div className="flex items-center justify-center bg-white ">
        <div className="max-w-md mx-auto rounded-lg overflow-hidden md:max-w-xl">
          <div className="md:flex">
            <div className="w-full p-3">
              <div className="relative border-dotted h-48 max-h-44 overflow-y-auto rounded-lg border-dashed border-2 border-blue-700 bg-gray-100 flex justify-center items-center">
                 
                  <div className="absolute">
                    <div className="flex flex-col items-center">
                    {files && files.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {Array.from(files).map(file => (
                          <div key={file.name} className="relative border border-dotted border-blue-700 bg-blue-10 text-xs w-30 p-1 px-2 rounded-md">
                            {/* Close Icon in the Top Right */}
                            <button 
                              onClick={() => removeFile(file.name)} 
                              className="absolute top-1 right-1 text-red-500 hover:text-red-700 cursor-pointer"
                            >
                              <X size={10} />
                            </button>
                            <span className="block truncate">{file.name}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className='flex flex-col items-center'>  
                        <i className="fa fa-folder-open fa-5x text-blue-700"></i>
                        <span className="block text-gray-400 font-normal">Attach your images here</span>
                      </div>
                    )}
                    </div>
                  </div>
                <input accept="image/heic" onChange={handleFileChange} type="file" className="opacity-0" name="" multiple />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Format Option Section */}
      <div className="flex items-center justify-center w-full mt-1">
        <select value={format} onChange={handleFormatChange} className="border border-gray-300 p-2 w-60 rounded-md">
          <option value="jpeg">JPEG</option>
          <option value="png">PNG</option>
          <option value="webp">WebP</option>
        </select>
      </div>
      {/* Image size Section */}
      <div className="flex items-center justify-center w-full mt-2">
        <input type="number" value={width} onChange={handleWidthChange} className="border border-gray-300 p-2 w-60 rounded-md" />
      </div>
      {/* Button Section */}
      <div className="flex items-center justify-center w-full mt-5">
        <button onClick={handleConvert} className="convert-button border border-gray-300 p-2 w-60 bg-blue-700 text-white rounded-md" disabled={loading}>
          {loading ? 'Processing...' : 'Convert'}
        </button>
      </div>
      {/* Display Images Section */}
      {loading && <p className="loading-text text-orange-500 text-base">Converting image, please wait...</p>}
      {convertedImages.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-5">
          {convertedImages.map((image, index) => (
            <div key={index} className="p-2 border rounded-lg shadow-md">
              <img src={image} alt={`Converted ${index}`} className="w-24 h-24 object-contain rounded" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

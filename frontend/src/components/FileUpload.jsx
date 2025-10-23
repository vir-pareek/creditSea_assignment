import React, { useState } from 'react';
import axios from 'axios';

// We receive the callback functions and apiUrl as 'props' from the parent
const FileUpload = ({ onUploadSuccess, onUploadError, apiUrl }) => {
  // We use 'useState' to keep track of the file the user selects
  // and the uploading status. This state is *local* to this component.
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const onFileChange = (e) => {
    // 'e.target.files' is a list, we just want the first one
    setFile(e.target.files[0]);
  };

  // This function runs when the user clicks "Upload"
  const onSubmit = async (e) => {
    e.preventDefault(); // Stop the browser from refreshing the page
    if (!file) {
      onUploadError('Please select a file to upload.');
      return;
    }

    // MODERN PRACTICE: FormData
    // This is the standard way to send files to a backend API.
    const formData = new FormData();
    formData.append('xmlfile', file); // 'xmlfile' MUST match the name in your backend's multer config
    
    setIsUploading(true);

    try {
      // We use 'await' to wait for the API call to finish
      const res = await axios.post(`${apiUrl}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // This header is required for file uploads
        },
      });

      // It worked! Call the parent's success function
      onUploadSuccess(res.data.message);
      
    } catch (err) {
      // It failed. Call the parent's error function
      const msg = err.response?.data?.message || 'File upload failed.';
      onUploadError(msg);
      console.error(err);
    }

    setIsUploading(false); // We're done uploading
    setFile(null); // Clear the file input
    e.target.reset(); // Reset the form
  };

  return (
    // This is a common pattern for a styled "card" component
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upload Credit Report</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="file-upload" className="sr-only">Choose file</label>
          {/* This is a modern trick for styling file inputs.
            The 'input' is hidden ('hidden')
            The 'label' is styled to look like a drop zone.
          */}
          <input 
            type="file" 
            accept=".xml,text/xml" 
            onChange={onFileChange}
            id="file-upload"
            className="hidden" 
          />
          <label 
            htmlFor="file-upload" 
            className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-gray-50"
          >
            {file ? (
              <span className="text-green-600 font-medium">{file.name}</span>
            ) : (
              <span className="text-gray-500">Drag and drop or click to choose file (.xml)</span>
            )}
          </label>
        </div>
        
        <button 
          type="submit" 
          // We disable the button if no file is selected or if we're uploading
          disabled={!file || isUploading}
          // We use Tailwind's 'disabled:' prefix to style the disabled state
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg
                     hover:bg-blue-700 transition duration-200
                     disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {/* We show different text based on the 'isUploading' state */}
          {isUploading ? 'Uploading...' : 'Upload & Process'}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
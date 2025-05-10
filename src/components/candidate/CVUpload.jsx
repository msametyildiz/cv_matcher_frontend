import React, { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { Upload, X, FileText } from 'lucide-react';
import api from '../../api';

const CVUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    // Validate file type
    const fileExtension = selectedFile.name.slice(selectedFile.name.lastIndexOf('.')).toLowerCase();
    if (!['.pdf', '.docx'].includes(fileExtension)) {
      setError('Invalid file type. Only PDF and DOCX files are allowed.');
      return;
    }
    
    // Validate file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds the maximum limit of 5MB.');
      return;
    }
    
    setFile(selectedFile);
    setError('');
    
    // Create a preview for the file
    setPreview({
      name: selectedFile.name,
      size: selectedFile.size,
      type: fileExtension === '.pdf' ? 'pdf' : 'docx'
    });
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length) {
      const event = { target: { files: droppedFiles } };
      handleFileChange(event);
    }
  };
  
  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };
  
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return newProgress;
        });
      }, 300);
      
      // API call to upload the CV
      const response = await api.cv.uploadCV(formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast.success('CV uploaded successfully!');
      
      // Reset form
      setFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Call the success callback if provided
      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }
    } catch (error) {
      console.error('Error uploading CV:', error);
      const errorMessage = error.response?.data?.message || 'Failed to upload CV. Please try again.';
      toast.error(errorMessage);
      setError(errorMessage);
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload Your CV</h2>
      
      <div 
        className={`mt-2 p-6 border-2 border-dashed rounded-lg ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
        } ${file ? 'border-blue-300 bg-blue-50' : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {!file ? (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  ref={fileInputRef}
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-gray-600">
              PDF or DOCX up to 5MB
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className={`h-10 w-10 ${preview?.type === 'pdf' ? 'text-red-500' : 'text-blue-500'}`} />
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">
                  {preview?.name}
                </div>
                <div className="text-xs text-gray-500">
                  {formatFileSize(preview?.size)}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="ml-4 bg-white rounded-md p-1 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Remove file</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
      
      {isUploading && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Uploading...</span>
            <span className="text-sm font-medium text-gray-700">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="mt-4">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleUpload}
          disabled={!file || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload CV'}
        </button>
      </div>
      
      <div className="mt-6 text-sm text-gray-500">
        <h3 className="font-medium text-gray-700">Accepted file formats:</h3>
        <ul className="mt-2 list-disc list-inside">
          <li>PDF files (.pdf)</li>
          <li>Microsoft Word documents (.docx)</li>
        </ul>
      </div>
    </div>
  );
};

export default CVUpload;
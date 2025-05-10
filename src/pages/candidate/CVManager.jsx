import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Trash2, Check, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../api';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import CVUpload from '../../components/candidate/CVUpload';

const CVManager = () => {
  const [cvs, setCvs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  
  useEffect(() => {
    const fetchCVs = async () => {
      setIsLoading(true);
      try {
        // In a real application, we would fetch CVs from the API
        // const response = await api.cv.getCurrentUserCVs();
        // setCvs(response.data);
        
        // For now, we'll use mock data
        setCvs([
          { id: 1, filename: 'My_Resume.pdf', uploadDate: '2023-04-15', isPrimary: true },
          { id: 2, filename: 'Alternative_CV.docx', uploadDate: '2023-03-10', isPrimary: false },
        ]);
      } catch (error) {
        console.error('Error fetching CVs:', error);
        setError('Failed to load your CVs. Please try again.');
        toast.error('Error loading CVs');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCVs();
  }, []);
  
  const handleDelete = async (cvId) => {
    try {
      // await api.cv.deleteCV(cvId);
      setCvs(prevCvs => prevCvs.filter(cv => cv.id !== cvId));
      toast.success('CV deleted successfully');
    } catch (error) {
      console.error('Error deleting CV:', error);
      toast.error('Failed to delete CV');
    }
  };
  
  const handleSetPrimary = async (cvId) => {
    try {
      // await api.cv.setPrimaryCV(cvId);
      setCvs(prevCvs => prevCvs.map(cv => ({
        ...cv,
        isPrimary: cv.id === cvId
      })));
      toast.success('Primary CV updated');
    } catch (error) {
      console.error('Error setting primary CV:', error);
      toast.error('Failed to update primary CV');
    }
  };
  
  const handleDownload = async (cvId, filename) => {
    try {
      // const response = await api.cv.downloadCV(cvId);
      // // Create a download link
      // const url = window.URL.createObjectURL(new Blob([response.data]));
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', filename);
      // document.body.appendChild(link);
      // link.click();
      // link.remove();
      
      toast.success('CV downloaded successfully');
    } catch (error) {
      console.error('Error downloading CV:', error);
      toast.error('Failed to download CV');
    }
  };
  
  const handleUploadSuccess = (newCV) => {
    setCvs(prevCvs => [...prevCvs, newCV]);
    setShowUploadForm(false);
    toast.success('CV uploaded successfully');
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (isLoading) {
    return <Loader />;
  }
  
  if (error) {
    return <ErrorMessage message={error} />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My CVs</h1>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => setShowUploadForm(!showUploadForm)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Upload New CV
        </button>
      </div>
      
      {showUploadForm && (
        <CVUpload onUploadSuccess={handleUploadSuccess} />
      )}
      
      {cvs.length > 0 ? (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {cvs.map((cv) => (
              <li key={cv.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className={`h-6 w-6 ${cv.filename.endsWith('.pdf') ? 'text-red-500' : 'text-blue-500'} mr-3`} />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{cv.filename}</div>
                      <div className="text-xs text-gray-500">Uploaded on {formatDate(cv.uploadDate)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {cv.isPrimary ? (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Primary
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(cv.id)}
                        className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Check className="mr-1 h-3 w-3" />
                        Set as Primary
                      </button>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => handleDownload(cv.id, cv.filename)}
                      className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleDelete(cv.id)}
                      className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-gray-400 hover:bg-gray-100 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      disabled={cv.isPrimary}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No CVs uploaded</h3>
          <p className="mt-1 text-gray-500">
            Upload your CV to start applying for jobs.
          </p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setShowUploadForm(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Upload CV
            </button>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">CV Tips</h2>
        <h2 className="text-lg font-medium text-gray-900 mb-4">CV Tips</h2>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
          <li>Keep your CV concise and focused, ideally 1-2 pages.</li>
          <li>Highlight your key skills and achievements at the top.</li>
          <li>Tailor your CV for each job application to match the requirements.</li>
          <li>Use bullet points to make your CV easy to scan.</li>
          <li>Include measurable achievements rather than just listing responsibilities.</li>
          <li>Make sure your contact information is up-to-date.</li>
        </ul>
      </div>
    </div>
  );
};

export default CVManager;
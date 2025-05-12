import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  FileText, Upload, Download, Trash2, Check, Eye, 
  AlertCircle, Calendar, Star, Pencil
} from 'lucide-react';
import api from '../../api';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import CVUpload from '../../components/candidate/CVUpload';
import Modal from '../../components/common/Modal';

const CVManager = () => {
  const [cvs, setCvs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cvToDelete, setCvToDelete] = useState(null);
  const [showCVDetails, setShowCVDetails] = useState(false);
  const [selectedCV, setSelectedCV] = useState(null);
  
  useEffect(() => {
    fetchCVs();
  }, []);
  
  const fetchCVs = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock data for development
      setTimeout(() => {
        setCvs([
          { 
            id: 1, 
            filename: 'Professional_Resume_2023.pdf', 
            uploadDate: '2023-04-15', 
            lastModified: '2023-05-10',
            isPrimary: true,
            fileSize: '364 KB',
            fileType: 'application/pdf',
            previewAvailable: true,
            parsedData: {
              skills: ['React', 'JavaScript', 'Node.js', 'CSS', 'HTML', 'Git'],
              education: [
                { degree: 'Bachelor of Science in Computer Science', institution: 'State University', year: '2020' }
              ],
              experience: [
                { role: 'Frontend Developer', company: 'Tech Solutions Inc.', period: 'Jan 2021 - Present' },
                { role: 'Web Developer Intern', company: 'Digital Agency', period: 'Jun 2020 - Dec 2020' }
              ]
            }
          },
          { 
            id: 2, 
            filename: 'Creative_CV_Tailored.docx', 
            uploadDate: '2023-03-10', 
            lastModified: '2023-03-10',
            isPrimary: false,
            fileSize: '285 KB',
            fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            previewAvailable: false,
            parsedData: {
              skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'Wireframing', 'React', 'CSS'],
              education: [
                { degree: 'Certificate in UI/UX Design', institution: 'Design Academy', year: '2021' },
                { degree: 'Bachelor of Science in Computer Science', institution: 'State University', year: '2020' }
              ],
              experience: [
                { role: 'UI/UX Designer', company: 'Creative Studios', period: 'Mar 2021 - Present' },
                { role: 'Junior Web Developer', company: 'StartUp Inc.', period: 'Jul 2020 - Feb 2021' }
              ]
            }
          }
        ]);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching CVs:', error);
      setError('Failed to load your CVs. Please try again.');
      setIsLoading(false);
    }
  };
  
  const handleUploadSuccess = (newCV) => {
    setCvs(prevCvs => [newCV, ...prevCvs]);
    setShowUploadForm(false);
    toast.success('CV uploaded successfully');
  };
  
  const handleDeleteClick = (cv) => {
    setCvToDelete(cv);
    setShowDeleteModal(true);
  };
  
  const handleDelete = async () => {
    if (!cvToDelete) return;
    
    try {
      setCvs(prevCvs => prevCvs.filter(cv => cv.id !== cvToDelete.id));
      toast.success('CV deleted successfully');
      setShowDeleteModal(false);
      setCvToDelete(null);
    } catch (error) {
      console.error('Error deleting CV:', error);
      toast.error('Failed to delete CV');
    }
  };
  
  const handleSetPrimary = async (cvId) => {
    try {
      setCvs(prevCvs => prevCvs.map(cv => ({
        ...cv,
        isPrimary: cv.id === cvId
      })));
      
      toast.success('Primary CV updated successfully');
    } catch (error) {
      console.error('Error setting primary CV:', error);
      toast.error('Failed to update primary CV');
    }
  };
  
  const handleDownload = async (cv) => {
    try {
      toast.success(`Downloading ${cv.filename}`);
    } catch (error) {
      console.error('Error downloading CV:', error);
      toast.error('Failed to download CV');
    }
  };
  
  const handleViewDetails = (cv) => {
    setSelectedCV(cv);
    setShowCVDetails(true);
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getFileIcon = (fileType) => {
    if (fileType === 'application/pdf') {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else if (fileType.includes('word')) {
      return <FileText className="h-5 w-5 text-blue-500" />;
    } else {
      return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCVs} />;
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Resume & CVs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all your resumes and CVs in one place
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload New CV
          </button>
        </div>
      </div>
      
      {showUploadForm && (
        <div className="mb-8 bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <CVUpload onUploadSuccess={handleUploadSuccess} />
          </div>
        </div>
      )}
      
      {cvs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <FileText className="h-6 w-6 text-blue-600" aria-hidden="true" />
          </div>
          <h3 className="mt-5 text-lg leading-6 font-medium text-gray-900">No CVs Found</h3>
          <p className="mt-2 text-sm text-gray-500">
            Get started by uploading your first CV.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowUploadForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Your First CV
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* CV List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {cvs.map((cv) => (
                <li key={cv.id} className={`${cv.isPrimary ? 'bg-blue-50' : 'bg-white'} hover:bg-gray-50`}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getFileIcon(cv.fileType)}
                        <p className="ml-3 text-sm font-medium text-gray-900">{cv.filename}</p>
                        {cv.isPrimary && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Star className="mr-1 h-3 w-3" />
                            Primary
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => handleViewDetails(cv)}
                          className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownload(cv)}
                          className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        {!cv.isPrimary && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(cv.id)}
                              className="inline-flex items-center p-1.5 border border-blue-300 shadow-sm text-xs rounded text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteClick(cv)}
                              className="inline-flex items-center p-1.5 border border-red-300 shadow-sm text-xs rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex sm:space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <p>Uploaded on {formatDate(cv.uploadDate)}</p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <Pencil className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <p>Last modified {formatDate(cv.lastModified)}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <span>{cv.fileSize}</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* CV Tips */}
          <div className="mt-8 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">CV Tips</h3>
              <div className="mt-4 text-sm text-gray-500">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Keep your CV concise and focused, ideally 1-2 pages.</li>
                  <li>Highlight your key skills and achievements at the top.</li>
                  <li>Tailor your CV for each job application to match the requirements.</li>
                  <li>Use bullet points to make your CV easy to scan.</li>
                  <li>Include measurable achievements rather than just listing responsibilities.</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete CV"
        size="sm"
      >
        <div className="p-6">
          <div className="flex items-center justify-center mb-4 text-red-500">
            <AlertCircle className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-center text-gray-900 mb-4">
            Are you sure?
          </h3>
          <p className="text-sm text-gray-500 mb-6 text-center">
            You're about to delete <strong>{cvToDelete?.filename}</strong>. This action cannot be undone.
          </p>
          <div className="flex space-x-4 justify-center">
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
      
      {/* CV Details Modal */}
      <Modal
        isOpen={showCVDetails}
        onClose={() => setShowCVDetails(false)}
        title="CV Details"
        size="lg"
      >
        {selectedCV && (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                {getFileIcon(selectedCV.fileType)}
                <span className="ml-2">{selectedCV.filename}</span>
              </h3>
              <div className="flex space-x-4">
                <span className="text-sm text-gray-500">Uploaded on {formatDate(selectedCV.uploadDate)}</span>
                <span className="text-sm text-gray-500">Size: {selectedCV.fileSize}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-4">
              <h4 className="text-md font-medium text-gray-900 mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCV.parsedData.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-4">
              <h4 className="text-md font-medium text-gray-900 mb-2">Education</h4>
              <ul className="space-y-3">
                {selectedCV.parsedData.education.map((edu, index) => (
                  <li key={index} className="text-sm">
                    <p className="font-medium text-gray-900">{edu.degree}</p>
                    <p className="text-gray-500">{edu.institution}, {edu.year}</p>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-4">
              <h4 className="text-md font-medium text-gray-900 mb-2">Experience</h4>
              <ul className="space-y-3">
                {selectedCV.parsedData.experience.map((exp, index) => (
                  <li key={index} className="text-sm">
                    <p className="font-medium text-gray-900">{exp.role}</p>
                    <p className="text-gray-500">{exp.company} • {exp.period}</p>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between">
              <button
                type="button"
                onClick={() => handleDownload(selectedCV)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </button>
              
              {!selectedCV.isPrimary && (
                <button
                  type="button"
                  onClick={() => {
                    handleSetPrimary(selectedCV.id);
                    setShowCVDetails(false);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Star className="mr-2 h-4 w-4" />
                  Set as Primary
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CVManager;
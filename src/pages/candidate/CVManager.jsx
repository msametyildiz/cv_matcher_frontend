import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  FileText, Upload, Download, Trash2, Check, Eye, 
  AlertCircle, Calendar, Star, Pencil, Plus, 
  ArrowDown, ArrowUp, ExternalLink
} from 'lucide-react';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import CVUpload from '../../components/candidate/CVUpload';
import Modal from '../../components/common/Modal';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '../../components/common/Tabs';

const CVManager = () => {
  const [cvs, setCvs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cvToDelete, setCvToDelete] = useState(null);
  const [showCVDetails, setShowCVDetails] = useState(false);
  const [selectedCV, setSelectedCV] = useState(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newFilename, setNewFilename] = useState('');
  const [currentView, setCurrentView] = useState('grid');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [cvPreviewUrl, setCvPreviewUrl] = useState(null);
  
  useEffect(() => {
    fetchCVs();
  }, []);
  
  const fetchCVs = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock data for development
      setTimeout(() => {
        const mockCVs = [
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
          },
          { 
            id: 3, 
            filename: 'Technical_CV_Backend.pdf', 
            uploadDate: '2023-05-02', 
            lastModified: '2023-05-02',
            isPrimary: false,
            fileSize: '412 KB',
            fileType: 'application/pdf',
            previewAvailable: true,
            parsedData: {
              skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS', 'API Design'],
              education: [
                { degree: 'Bachelor of Science in Computer Science', institution: 'State University', year: '2020' }
              ],
              experience: [
                { role: 'Backend Developer', company: 'Data Systems Inc.', period: 'Feb 2021 - Present' },
                { role: 'IT Intern', company: 'Tech Corp', period: 'May 2020 - Jan 2021' }
              ]
            }
          }
        ];
        setCvs(mockCVs);
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
  
  const handleRenameClick = (cv) => {
    setSelectedCV(cv);
    setNewFilename(cv.filename);
    setShowRenameModal(true);
  };
  
  const handleRename = async () => {
    if (!selectedCV || !newFilename.trim()) return;
    
    try {
      setCvs(prevCvs => prevCvs.map(cv => 
        cv.id === selectedCV.id ? { ...cv, filename: newFilename } : cv
      ));
      toast.success('CV renamed successfully');
      setShowRenameModal(false);
    } catch (error) {
      console.error('Error renaming CV:', error);
      toast.error('Failed to rename CV');
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
  
  const handlePreview = (cv) => {
    if (!cv.previewAvailable) {
      toast.error('Preview not available for this file type');
      return;
    }
    
    // In a real app, you would get the actual URL
    setCvPreviewUrl(`/preview/${cv.id}`);
    
    // For the mock, we'll just show the details modal
    setSelectedCV(cv);
    setShowCVDetails(true);
  };
  
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
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
  
  // Sort CVs based on user selection
  const sortedCVs = [...cvs].sort((a, b) => {
    if (sortBy === 'date') {
      return sortDirection === 'asc' 
        ? new Date(a.uploadDate) - new Date(b.uploadDate)
        : new Date(b.uploadDate) - new Date(a.uploadDate);
    } else if (sortBy === 'name') {
      return sortDirection === 'asc'
        ? a.filename.localeCompare(b.filename)
        : b.filename.localeCompare(a.filename);
    } else if (sortBy === 'size') {
      // This is a simplified version, in a real app parse the actual sizes
      const sizeA = parseInt(a.fileSize);
      const sizeB = parseInt(b.fileSize);
      return sortDirection === 'asc' ? sizeA - sizeB : sizeB - sizeA;
    }
    return 0;
  });
  
  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCVs} />;
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Resume & CVs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all your resumes and CVs in one place. Your primary CV will be used as the default when applying to jobs.
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
      
      {/* Tabs and View Controls */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-4 py-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center border-b border-gray-200">
          <TabGroup>
            <TabList>
              <Tab>All CVs</Tab>
              <Tab>Primary</Tab>
              <Tab>Recent</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {/* Content for All CVs tab */}
              </TabPanel>
              <TabPanel>
                {/* Content for Primary tab */}
              </TabPanel>
              <TabPanel>
                {/* Content for Recent tab */}
              </TabPanel>
            </TabPanels>
          </TabGroup>
          
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              >
                <option value="date">Date</option>
                <option value="name">Name</option>
                <option value="size">Size</option>
              </select>
              <button
                onClick={toggleSortDirection}
                className="inline-flex items-center p-1 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                {sortDirection === 'asc' ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">View:</span>
              <button
                onClick={() => setCurrentView('grid')}
                className={`p-1 rounded-md ${
                  currentView === 'grid' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentView('list')}
                className={`p-1 rounded-md ${
                  currentView === 'list' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
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
          {/* CV List/Grid View */}
          {currentView === 'list' ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {sortedCVs.map((cv) => (
                  <li key={cv.id} className={`${cv.isPrimary ? 'bg-blue-50' : 'bg-white'} hover:bg-gray-50`}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getFileIcon(cv.fileType)}
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{cv.filename}</p>
                            <div className="flex space-x-2 mt-1">
                              <p className="text-xs text-gray-500">Uploaded: {formatDate(cv.uploadDate)}</p>
                              <p className="text-xs text-gray-500">Size: {cv.fileSize}</p>
                            </div>
                          </div>
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
                            onClick={() => handlePreview(cv)}
                            className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={!cv.previewAvailable}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleViewDetails(cv)}
                            className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <ExternalLink className="h-4 w-4" />
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
                                onClick={() => handleRenameClick(cv)}
                                className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                <Pencil className="h-4 w-4" />
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
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCVs.map((cv) => (
                <div key={cv.id} className={`bg-white shadow rounded-lg overflow-hidden ${cv.isPrimary ? 'ring-2 ring-blue-500' : ''}`}>
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center">
                      {getFileIcon(cv.fileType)}
                      <span className="ml-2 text-sm font-medium truncate" title={cv.filename}>
                        {cv.filename}
                      </span>
                    </div>
                    {cv.isPrimary && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Star className="mr-1 h-3 w-3" />
                        Primary
                      </span>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <div>
                        <Calendar className="inline h-4 w-4 mr-1 mb-1" />
                        {formatDate(cv.uploadDate)}
                      </div>
                      <div>{cv.fileSize}</div>
                    </div>
                    
                    {/* Skills preview */}
                    {cv.parsedData.skills && cv.parsedData.skills.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-medium text-gray-700 mb-1">Skills</h4>
                        <div className="flex flex-wrap gap-1">
                          {cv.parsedData.skills.slice(0, 5).map((skill, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800">
                              {skill}
                            </span>
                          ))}
                          {cv.parsedData.skills.length > 5 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800">
                              +{cv.parsedData.skills.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Latest experience */}
                    {cv.parsedData.experience && cv.parsedData.experience.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-medium text-gray-700 mb-1">Latest Experience</h4>
                        <p className="text-sm font-medium">{cv.parsedData.experience[0].role}</p>
                        <p className="text-xs text-gray-500">{cv.parsedData.experience[0].company} • {cv.parsedData.experience[0].period}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => handlePreview(cv)}
                          className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          disabled={!cv.previewAvailable}
                          title={cv.previewAvailable ? "Preview" : "Preview not available"}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleViewDetails(cv)}
                          className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          title="View Details"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownload(cv)}
                          className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="flex space-x-2">
                        {!cv.isPrimary ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(cv.id)}
                              className="inline-flex items-center p-1.5 border border-blue-300 shadow-sm text-xs rounded text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              title="Set as Primary"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteClick(cv)}
                              className="inline-flex items-center p-1.5 border border-red-300 shadow-sm text-xs rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-blue-600 font-medium">Primary CV</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add new CV button in grid view */}
              <div 
                className="flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-100 transition"
                onClick={() => setShowUploadForm(true)}
              >
                <div className="rounded-full bg-blue-100 p-3 mb-4">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">Upload New CV</p>
                <p className="mt-1 text-xs text-gray-500">PDF or DOCX up to 5MB</p>
              </div>
            </div>
          )}
          
          {/* CV Tips */}
          <div className="mt-8 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">CV Tips</h3>
              <div className="mt-4 text-sm text-gray-500">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Keep your CV concise and focused, ideally 1-2 pages.</li>
                  <li>Tailor your CV for each job application to match the requirements.</li>
                  <li>Include measurable achievements rather than just listing responsibilities.</li>
                  <li>Regularly update your CV with new skills and experiences.</li>
                  <li>Use industry-specific keywords to help your CV get noticed by applicant tracking systems.</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Modals */}
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
      
      <Modal
        isOpen={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        title="Rename CV"
        size="sm"
      >
        <div className="p-6">
          <div className="mb-4">
            <label htmlFor="newFilename" className="block text-sm font-medium text-gray-700 mb-1">
              New filename
            </label>
            <input
              type="text"
              id="newFilename"
              value={newFilename}
              onChange={(e) => setNewFilename(e.target.value)}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          
          <div className="flex space-x-4 justify-end">
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setShowRenameModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleRename}
            >
              Rename
            </button>
          </div>
        </div>
      </Modal>
      
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
                {selectedCV.isPrimary && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Star className="mr-1 h-3 w-3" />
                    Primary
                  </span>
                )}
              </h3>
              <div className="flex space-x-4">
                <span className="text-sm text-gray-500">Uploaded on {formatDate(selectedCV.uploadDate)}</span>
                <span className="text-sm text-gray-500">Size: {selectedCV.fileSize}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
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
              </div>
              
              <div>
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h4 className="text-md font-medium text-gray-900 mb-2">Experience</h4>
                  <ul className="space-y-4">
                    {selectedCV.parsedData.experience.map((exp, index) => (
                      <li key={index} className="text-sm border-l-2 border-blue-200 pl-4">
                        <p className="font-medium text-gray-900">{exp.role}</p>
                        <p className="text-gray-500">{exp.company} • {exp.period}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-6 flex justify-end space-x-3">
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
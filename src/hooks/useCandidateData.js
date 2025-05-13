import { useState, useEffect } from 'react';
import useApi from './useApi';

// Custom hook to fetch and manage candidate data
const useCandidateData = (candidateId) => {
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matchingJobs, setMatchingJobs] = useState([]);
  
  const api = useApi();
  
  // Fetch candidate data
  useEffect(() => {
    const fetchCandidate = async () => {
      if (!candidateId) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // In a real app, this would be an API call
        // const response = await api.get(`/api/candidates/${candidateId}`);
        // setCandidate(response.data);
        
        // Mock data for development
        setTimeout(() => {
          const mockCandidate = {
            id: candidateId,
            firstName: 'John',
            lastName: 'Smith',
            title: 'Senior Software Engineer',
            email: 'john.smith@example.com',
            phone: '+1 (555) 123-4567',
            location: 'San Francisco, CA',
            skills: ['JavaScript', 'React', 'Node.js', 'AWS', 'TypeScript', 'MongoDB'],
            summary: 'Experienced software developer with over 8 years in full-stack development.',
            experience: [
              {
                title: 'Senior Software Engineer',
                company: 'Tech Innovators Inc.',
                period: 'Jan 2020 - Present',
                description: 'Leading development of enterprise SaaS products and mentoring junior developers.'
              },
              {
                title: 'Software Developer',
                company: 'Digital Solutions LLC',
                period: 'Mar 2017 - Dec 2019',
                description: 'Developed and maintained web applications using React and Node.js.'
              }
            ],
            education: [
              {
                degree: 'Master of Computer Science',
                institution: 'University of Technology',
                period: '2015 - 2017'
              },
              {
                degree: 'Bachelor of Science in Computer Engineering',
                institution: 'State University',
                period: '2011 - 2015'
              }
            ],
            cv: {
              name: 'John_Smith_Resume.pdf',
              uploadDate: '2023-06-15',
              summary: 'Full-stack developer with expertise in modern JavaScript frameworks and cloud services.',
              downloadUrl: '#'
            },
            lastActive: '2 days ago'
          };
          
          setCandidate(mockCandidate);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError(err.message || 'Failed to fetch candidate data');
        setLoading(false);
      }
    };
    
    fetchCandidate();
  }, [candidateId]);
  
  // Fetch matching jobs
  useEffect(() => {
    const fetchMatchingJobs = async () => {
      if (!candidateId) return;
      
      try {
        // In a real app, this would be an API call
        // const response = await api.get(`/api/candidates/${candidateId}/matching-jobs`);
        // setMatchingJobs(response.data);
        
        // Mock data for development
        setTimeout(() => {
          const mockJobs = [
            {
              id: 'job-001',
              title: 'Senior Frontend Developer',
              company: 'Tech Innovators Inc.',
              location: 'San Francisco, CA',
              isRemote: true,
              employmentType: 'Full-time',
              experience: 'Senior',
              postedDateText: '3 days ago',
              matchPercentage: 95,
              matchingSkills: ['React', 'JavaScript', 'TypeScript']
            },
            {
              id: 'job-002',
              title: 'Full Stack Engineer',
              company: 'Digital Solutions Co.',
              location: 'New York, NY',
              isRemote: false,
              employmentType: 'Full-time',
              experience: 'Mid-Senior',
              postedDateText: '1 week ago',
              matchPercentage: 87,
              matchingSkills: ['Node.js', 'JavaScript', 'MongoDB']
            }
          ];
          
          setMatchingJobs(mockJobs);
        }, 1000);
      } catch (err) {
        console.error('Error fetching matching jobs:', err);
      }
    };
    
    fetchMatchingJobs();
  }, [candidateId]);
  
  return { candidate, loading, error, matchingJobs };
};

export default useCandidateData;

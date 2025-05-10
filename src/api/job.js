const jobApi = (apiClient) => {
    return {
      createJob: (jobData) => {
        return apiClient.post('/jobs', jobData);
      },
  
      getJobById: (jobId) => {
        return apiClient.get(`/jobs/${jobId}`);
      },
  
      updateJob: (jobId, jobData) => {
        return apiClient.put(`/jobs/${jobId}`, jobData);
      },
  
      deleteJob: (jobId) => {
        return apiClient.delete(`/jobs/${jobId}`);
      },
  
      getJobs: (options = {}) => {
        return apiClient.get('/jobs', { params: options });
      },
  
      searchJobs: (searchParams) => {
        return apiClient.post('/jobs/search', searchParams);
      },
  
      applyForJob: (jobId, applicationData) => {
        return apiClient.post(`/jobs/${jobId}/apply`, applicationData);
      },
  
      getRecommendedJobs: (limit = 10) => {
        return apiClient.get('/jobs/recommended', { params: { limit } });
      }
    };
  };
  
  export default jobApi;
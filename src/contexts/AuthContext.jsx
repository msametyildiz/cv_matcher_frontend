const matchingApi = (apiClient) => {
    return {
      getMatchingResultsByJobId: (jobId, options = {}) => {
        return apiClient.get(`/matching/job/${jobId}`, { params: options });
      },
  
      getMatchingResultsByCvId: (cvId, options = {}) => {
        return apiClient.get(`/matching/cv/${cvId}`, { params: options });
      },
  
      getDetailedMatchingResult: (cvId, jobId) => {
        return apiClient.get(`/matching/result/${cvId}/${jobId}`);
      },
  
      matchCvWithJob: (cvId, jobId) => {
        return apiClient.post('/matching/match', { cvId, jobId });
      }
    };
  };
  
  export default matchingApi;
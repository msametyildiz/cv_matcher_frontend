const cvApi = (apiClient) => {
    return {
      uploadCV: (formData) => {
        return apiClient.post('/cv/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      },
  
      getCVById: (cvId) => {
        return apiClient.get(`/cv/${cvId}`);
      },
  
      getCurrentUserCVs: () => {
        return apiClient.get('/cv/my-cvs');
      },
  
      deleteCV: (cvId) => {
        return apiClient.delete(`/cv/${cvId}`);
      },
  
      downloadCV: (cvId) => {
        return apiClient.get(`/cv/${cvId}/download`, {
          responseType: 'blob',
        });
      }
    };
  };
  
  export default cvApi;
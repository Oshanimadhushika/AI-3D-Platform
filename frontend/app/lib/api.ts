import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const designApi = {
  generateFromText: async (prompt: string, category: string) => {
    const response = await apiClient.post('/generate-from-text', {
      design: {
        prompt,
        category,
      },
    });
    return response.data;
  },

  generateFromImage: async (prompt: string, category: string, imageFile: File) => {
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('category', category);
    formData.append('image', imageFile);

    const response = await apiClient.post('/generate-from-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getDesigns: async () => {
    const response = await apiClient.get('/designs');
    return response.data;
  },

  deleteDesign: async (id: number) => {
    await apiClient.delete(`/designs/${id}`);
  },
};

export default apiClient;

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://hanime-api-rebuild.vercel.app/api',
});

export const getHome = async () => {
  const response = await api.get('/home');
  return response.data;
};

export const searchAnime = async (query: string) => {
  const response = await api.get(`/search?q=${query}`);
  return response.data;
};

export const getAnimeDetails = async (id: string) => {
  const response = await api.get(`/anime/${id}`);
  return response.data;
};

export const getEpisodes = async (id: string) => {
  const response = await api.get(`/anime/${id}/episodes`);
  return response.data;
};

export const getEpisodeSource = async (id: string, ep: string | number) => {
  const response = await api.get(`/anime/${id}/ep/${ep}`);
  return response.data;
};

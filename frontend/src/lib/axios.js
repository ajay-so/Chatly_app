import axios from 'axios';

const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: import.meta.env.MODE === 'development'
      ? 'http://localhost:5000/api'
      : 'https://chatly-app.onrender.com/api',
      withCredentials: true,
  });

  return instance;
};

export default createAxiosInstance();
import axios from 'axios';

const createAxiosInstance = () => {
  const instance = axios.create({
      baseURL: 'https://chatly-app-meg2.onrender.com/api',
      withCredentials: true,
  });

  return instance;
};

export default createAxiosInstance();
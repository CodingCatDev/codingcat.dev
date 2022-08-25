import axios, { AxiosRequestConfig } from 'axios';
import { devto } from '../config/config';

export const addArticle = async (data: any) => {
  const URL = 'https://dev.to/api/articles/';

  const options: AxiosRequestConfig = {
    headers: {
      'api-key': devto,
      'Content-Type': 'application/json',
    },
  };

  return await axios.post(URL, data, options);
};

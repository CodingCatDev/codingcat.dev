import axios, { AxiosRequestConfig } from 'axios';

export const addArticle = async (data: any) => {
  const URL = 'https://dev.to/api/articles/';

  const options: AxiosRequestConfig = {
    headers: {
      'api-key': 'none',
      'Content-Type': 'application/json',
    },
  };

  return await axios.post(URL, data, options);
};

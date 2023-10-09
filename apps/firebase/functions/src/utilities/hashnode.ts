import axios, { AxiosRequestConfig } from 'axios';
import { hashnodeKey, hashnodePublicationId } from '../config/config';

export const createPublicationStory = async (input: any) => {
  const URL = 'https://api.hashnode.com/';

  const options: AxiosRequestConfig = {
    headers: {
      authorization: hashnodeKey,
      'Content-Type': 'application/json',
    },
  };

  const data = {
    operationName: 'createPublication',
    query: `mutation createPublication($input: CreateStoryInput!) { 
        createPublicationStory(
          publicationId: "${hashnodePublicationId}"
          input: $input
        ) {
        message
        post {
          _id
          title
          slug
        }
      }
    }
      `,
    variables: {
      input: {
        isPartOfPublication: {
          "publicationId": hashnodePublicationId,
        },
        ...input,
      },
    },
  };
  console.log('calling mutation with: ', data);
  try {
    return await axios.post(URL, data, options);
  } catch (error) {
    console.error(error);
    return;
  }
};

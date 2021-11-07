import { v2 as cloudinary } from 'cloudinary';

import {
  cloudinaryName,
  cloudinaryApiKey,
  cloudinaryApiSecret,
} from './../config/config';

const config = {
  cloud_name: cloudinaryName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret,
};
console.log('Cloudinary Config cloud_name', config.cloud_name);
cloudinary.config(config);

export default cloudinary;

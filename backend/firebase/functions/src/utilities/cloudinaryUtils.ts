import cloudinary from './cloudinary';

export const generateCodingCatCoverURL = async ({
  title,
  slug,
  guestName,
  guestImagePublicId,
  backgroundPath,
}: {
  title: string;
  slug: string;
  guestName: string;
  guestImagePublicId: string;
  backgroundPath: string;
}) => {
  const url = cloudinary.url(backgroundPath, {
    quality: 'auto',
    fetch_format: 'jpg',
    transformation: [
      {
        width: 1200,
        color: '#FBFBFB',
        y: '60',
        x: '0',
        crop: 'fit',
        gravity: 'north',
        background: '#4B0A75',
        radius: '8:50',
        border: '5px_solid_rgb:4B0A75',
        overlay: {
          text: title,
          font_family: 'Nunito',
          font_size: 100,
          font_weight: 'black',
          line_spacing: '-10',
          text_align: 'center',
        },
      },
      {
        color: '#FBFBFB',
        y: '577',
        x: '45',
        crop: 'limit',
        gravity: 'south_west',
        overlay: {
          font_family: 'Nunito',
          font_weight: 'bold',
          font_size: 60,
          text: 'With',
        },
      },
      {
        color: '#D11663',
        y: '410',
        x: '0',
        crop: 'fit',
        gravity: 'south_west',
        background: '#D11663',
        radius: '8:50',
        border: '30px_solid_rgb:D11663',
        overlay: {
          font_family: 'Nunito',
          font_size: 65,
          text: guestName,
          font_weight: 'bold',
          text_align: 'left',
        },
      },
      {
        color: '#FBFBFB',
        y: '417',
        x: '40',
        crop: 'fit',
        gravity: 'south_west',
        background: '#4B0A75',
        radius: '8:50',
        border: '30px_solid_rgb:4B0A75',
        overlay: {
          font_family: 'Nunito',
          font_size: 65,
          text: guestName,
          font_weight: 'bold',
          text_align: 'center',
        },
      },
      {
        overlay: guestImagePublicId.split('/').join(':'),
        height: '400',
        width: '400',
        y: '0',
        x: '0',
        gravity: 'south_west',
        crop: 'fill',
        border: '5px_solid_rgb:FBFBFB',
      },
    ],
  });

  //Write real image with new name
  const res = await cloudinary.uploader.upload(url, {
    public_id: slug,
  });
  return res.secure_url;
};

export const uploadCloudinaryFromUrl = async (
  publicId: string,
  url: string
) => {
  console.log(`Uploading image for: ${publicId}`);
  console.log(`Upload image from: ${url}`);
  try {
    const res = await cloudinary.uploader.upload(url, {
      public_id: publicId,
    });
    console.log('cloudinary payload response: ', JSON.stringify(res));
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

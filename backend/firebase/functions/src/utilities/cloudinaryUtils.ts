import cloudinary from './cloudinary';

export const generateCodingCatCoverURL = ({
  title,
  guestName,
  guestImagePublicId,
  backgroundPath,
}: {
  title: string;
  guestName: string;
  guestImagePublicId: string;
  backgroundPath: string;
}) => {
  const url = cloudinary.url(backgroundPath, {
    quality: 'auto',
    fetch_format: 'auto',
    transformation: [
      {
        width: 1600,
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
  return url;
};

export const uploadGuestProfilePicIfNotExists = async (
  guestImagePublicId: string,
  guestImageURL: string
) => {
  console.log(`Uploading image for: ${guestImagePublicId}`);
  console.log(`Upload image from: ${guestImageURL}`);
  try {
    const res = await cloudinary.uploader.upload(guestImageURL, {
      public_id: guestImagePublicId,
    });
    console.log('cloudinary payload response: ', JSON.stringify(res));
    return res.public_id;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

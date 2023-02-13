import cloudinary from './cloudinary';
export const generateCodeWithCodingCatCoverURL = async ({
  title,
  slug,
  guestName,
  guestImagePublicId,
  folder,
}: {
  title: string;
  slug: string;
  guestName: string;
  guestImagePublicId: string;
  folder: string;
}) => {
  const url = cloudinary.url(`${folder}/Code_with_Coding_Cat_Empty_Title`, {
    quality: 'auto',
    fetch_format: 'jpg',
    transformation: [
      {
        width: 1090,
        color: '#FBFBFB',
        y: '0',
        x: '100',
        crop: 'fit',
        gravity: 'west',
        overlay: {
          text: title,
          font_family: 'Nunito',
          font_size: 120,
          font_weight: 'black',
          line_spacing: '-10',
        },
      },
    ],
  });

  //Write real image with new name
  const res = await cloudinary.uploader.upload(url, {
    public_id: slug,
  });
  return res.secure_url;
};

export const generatePurrfectDevCoverURL = async ({
  title,
  slug,
  guestName,
  guestImagePublicId,
  folder,
}: {
  title: string;
  slug: string;
  guestName: string;
  guestImagePublicId: string;
  folder: string;
}) => {
  const url = cloudinary.url(`${folder}/codingcatdev-podcast-season2`, {
    quality: 'auto',
    fetch_format: 'jpg',
    transformation: [
      {
        width: 1200,
        color: '#FBFBFB',
        y: '59',
        x: '87',
        crop: 'fit',
        gravity: 'north_west',
        overlay: {
          text: title,
          font_family: 'Nunito',
          font_size: 96,
          font_weight: 'black',
          line_spacing: '-10',
          text_align: 'left',
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

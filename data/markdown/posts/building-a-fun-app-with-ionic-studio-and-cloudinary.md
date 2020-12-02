---
title: "Building a Fun App With Ionic Studio and Cloudinary"
date: "2019-08-12"
---

In the [JAMstack](https://jamstack.org/) world, [Cloudinary](https://cloudinary.com/) is the market leader as a comprehensive, cloud-based image- and video-management platform that’s in use by hundreds of thousands of users around the world, from startups to enterprises. In fact, it’s widely acclaimed as the best solution for hosting visual media on the web.[Ionic Studio](https://ionicframework.com/studio) is a robust IDE that efficiently and smoothly enables the development of cross-platform apps. In his November 2018 [announcement](https://ionicframework.com/blog/announcing-ionic-studio-a-powerful-new-way-to-build-apps/), CEO [Max Lynch](https://twitter.com/maxlynch) cogently elaborates on Ionic Studio’s many impressive capabilities, complete with a demo video.This post describes the procedure of uploading images to Cloudinary as a prelude for building a fun app called Face Smash with Ionic Studio. You upload a photo to Cloudinary with its [upload API](https://cloudinary.com/documentation/image_upload_api_reference) and then, by leveraging [Cloudinary’s face-detection feature](https://cloudinary.com/blog/face_detection_based_cropping), have Cloudinary display all the uploaded people photos with the one you just uploaded at the top. Click that photo and a water balloon appears and smashes the face in the photo.Read on for the steps.

## Uploading With Cloudinary APIs[](https://codingcat.dev/blog/building-a-fun-app-with-ionic-studio-and-cloudinary#uploading-with-cloudinary-apis)

Upload pictures to Cloudinary with its image upload API, unsigned, and complete the endpoint.

### API for Image Uploads[](https://codingcat.dev/blog/building-a-fun-app-with-ionic-studio-and-cloudinary#api-for-image-uploads)

Several SDKs are available for uploading images to Cloudinary through its [upload API](https://cloudinary.com/documentation/image_upload_api_reference). For simplicity, use the endpoint type for unsigned uploads for this app.Upload this picture of me in the much-coveted Ionic hat—

![Ionic hat](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1565636611/AlexPics/alex_ionic_hat_inside.png)

—by specifying the JPEG image with the `file` parameter, like this:

```
file=https://res.cloudinary.com/ajonp/image/upload/q_auto/AlexPics/alex_ionic_hat_inside.webp 
```

Cloudinary then adds a copy of that image to a location on a Cloudinary server.{note} The URL under `file` above is an example only. Feel free to specify a URL of your choice. {/note}Even though this app requires that you take a picture and then reference it with the `file` parameter, Cloudinary ultimately sends the Base64-encoded string to the endpoint.For details on all the upload options, see the [related Cloudinary documentation](https://cloudinary.com/documentation/upload_images#data_upload_options).

### Unsigned Uploads[](https://codingcat.dev/blog/building-a-fun-app-with-ionic-studio-and-cloudinary#unsigned-uploads)

To save time, opt for [unsigned-uploads](https://cloudinary.com/documentation/upload_images#unsigned_upload) to directly upload to Cloudinary from a browser or mobile app with no signature for authentication, bypassing your servers. However, for security reasons, you cannot specify certain upload parameters with unsigned upload calls. One of those parameters is `upload_preset`, a requirement for this app.As a workaround, create an upload preset in this screen in the Cloudinary [Console](https://cloudinary.com/console/settings/upload):

![](https://codingcat.dev/wp-content/uploads/2020/09/image-76.png)

![Upload Preset](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1565637994/ajonp-ajonp-com/blog/Screen_Shot_2019-08-12_at_3.26.07_PM.png)

That preset places all the newly uploaded photos in a folder called `ajonp-ionic-cloudinary-facesmash`, as specified at the bottom of the settings screen:.

![](https://codingcat.dev/wp-content/uploads/2020/09/image-77.png)

![preset folder](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/Screen_Shot_2019-08-12_at_3.30.49_PM.png)

`upload_preset` is now all set for incorporation into the code:

```
upload_preset=kuqm4xkg 
```

### Endpoint Uploads[](https://codingcat.dev/blog/building-a-fun-app-with-ionic-studio-and-cloudinary#endpoint-uploads)

Now complete the upload through the endpoint:

```
<video controls="controls" height="600">
  <source
    src="https://res.cloudinary.com/ajonp/video/upload/q_auto/ajonp-ajonp-com/blog/cloudinary_api_endpoing_upload.webm"
    type="video/webm"
  />
  <source
    src="https://res.cloudinary.com/ajonp/video/upload/q_auto/ajonp-ajonp-com/blog/cloudinary_api_endpoing_upload.mp4"
    type="video/mp4"
  />
</video>

```

```
https://api.cloudinary.com/v1_1/ajonp/image/upload?file=https://res.cloudinary.com/ajonp/image/upload/q_auto/AlexPics/alex_ionic_hat_inside.webp&upload_preset=kuqm4xkg 
```

Afterwards, a JSON payload returns, as in this example:

```
{
  "public_id": "ajonp-ionic-cloudinary-facesmash/raumizdelqrlows7pvzy",
  "version": 1565650174,
  "signature": "59905774f17ea06629ff90b73dfc9bed6c7fbdfd",
  "width": 2448,
  "height": 3264,
  "format": "jpg",
  "resource_type": "image",
  "created_at": "2019-08-12T22:49:34Z",
  "tags": [
    "facesmash",
    "face",
    "head",
    "chin",
    "selfie",
    "forehead",
    "photography",
    "fun"
  ],
  "pages": 1,
  "bytes": 1882858,
  "type": "upload",
  "etag": "4ae8ba0edfb90689101fdfbb8b97548d",
  "placeholder": false,
  "url": "http://res.cloudinary.com/ajonp/image/upload/q_auto/ajonp-ionic-cloudinary-facesmash/raumizdelqrlows7pvzy.webp",
  "secure_url": "https://res.cloudinary.com/ajonp/image/upload/q_auto/ajonp-ionic-cloudinary-facesmash/raumizdelqrlows7pvzy.webp",
  "access_mode": "public",
  "moderation": [
    {
      "response": { "moderation_labels": [] },
      "status": "approved",
      "kind": "aws_rek",
      "updated_at": "2019-08-12T22:49:36Z"
    }
  ],
  "info": {
    "categorization": {
      "google_tagging": {
        "status": "complete",
        "data": [
          { "tag": "Face", "confidence": 0.9635 },
          { "tag": "Head", "confidence": 0.9097 },
          { "tag": "Chin", "confidence": 0.8504 },
          { "tag": "Selfie", "confidence": 0.8183 },
          { "tag": "Forehead", "confidence": 0.7823 },
          { "tag": "Photography", "confidence": 0.738 },
          { "tag": "Fun", "confidence": 0.7039 },
          { "tag": "Headgear", "confidence": 0.6748 },
          { "tag": "Cap", "confidence": 0.6577 },
          { "tag": "T-shirt", "confidence": 0.5763 },
          { "tag": "Smile", "confidence": 0.5404 }
        ]
      }
    }
  },
  "faces": [[132, 906, 808, 1077]],
  "coordinates": { "faces": [[132, 906, 808, 1077]] },
  "original_filename": "alex_ionic_hat_inside"
}

```

Note this key line, which depicts that Cloudinary has picked up a face in the coordinates:

```
"coordinates": { "faces": [[132, 906, 808, 1077]] } 
```

However, facial detection sometimes doesn’t work. For example, it did not recognize that this is a picture of me, probably because of the shadows from my hat:

![Alex Ionic Hat Outside](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1565636611/AlexPics/alex_ionic_hat.png)

```
"coordinates":{"faces":[]} 
```

Here’s another problematic picture that resulted from erroneous coordinates of face detection, as shown in the second picture:

![Issue face detection](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/Screen_Shot_2019-08-12_at_9.16.51_PM.png)

![Example coordinates](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/Screen_Shot_2019-08-12_at_9.10.16_PM.png)

I’d be happy to work with the Cloudinary team to improve the success rate for facial detection.

## Leveraging Facial Detection in Cloudinary[](https://codingcat.dev/blog/building-a-fun-app-with-ionic-studio-and-cloudinary#leveraging-facial-detection-in-cloudinary)

[Cloudinary’s documentation on face detection](https://cloudinary.com/documentation/face_detection_based_transformations) describes in detail how to transform detected images by adding parameters..As a start, with the `g_face` parameter, you add gravity to the position of the largest face in the image, after which you can manipulate it as you see fit. Al the pictures in this app appear as thumbnails, as defined in this code:

```
http://res.cloudinary.com/ajonp/image/upload/w_1000,h_1000,c_crop,g_face,r_max/w_200/v1565650174/ajonp-ionic-cloudinary-facesmash/raumizdelqrlows7pvzy.webp 
```

An example is this cropped thumbnail:

![Cropped Sample Thumbnail](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/w_200/v1565650174/ajonp-ionic-cloudinary-facesmash/raumizdelqrlows7pvzy.png)

## Being careful in naming apps[](https://codingcat.dev/blog/building-a-fun-app-with-ionic-studio-and-cloudinary#being-careful-in-naming-apps)

I can’t help but think of [Facemash from the Social Network](https://youtu.be/VSKoVsHs_Ko), and don't want their to be confusion, this is a very fun project and we won't be rating anyone ????!! I am hoping that the Amazon Rekognition AI Moderation will catch most the bad stuff. If it gets out of hand I am going to take it down. I don't ever want to degrade anyone and write a [facemash apology](https://www.thecrimson.com/article/2003/11/19/facemash-creator-survives-ad-board-the/) like Zuck ????![](https://twitter.com/intent/tweet?url=https://codingcat.dev/blog/building-a-fun-app-with-ionic-studio-and-cloudinary&via=CodingCatDev&hashtags=CodingCatDevShares&text=Building%20a%20Fun%20App%20With%20Ionic%20Studio%20and%20Cloudinary%0a)[](https://www.linkedin.com/shareArticle?mini=true&url=https://codingcat.dev/blog/building-a-fun-app-with-ionic-studio-and-cloudinary&title=Building%20a%20Fun%20App%20With%20Ionic%20Studio%20and%20Cloudinary%0a&summary=%27#CodingCatDevShares'&source='codingcat.dev')[](https://www.facebook.com/sharer.php?u=https://codingcat.dev/blog/building-a-fun-app-with-ionic-studio-and-cloudinary)[](https://www.reddit.com/submit?url=https://codingcat.dev/blog/building-a-fun-app-with-ionic-studio-and-cloudinary&title=Building%20a%20Fun%20App%20With%20Ionic%20Studio%20and%20Cloudinary%0a)[](https://news.ycombinator.com/submitlink?u=https://codingcat.dev/blog/building-a-fun-app-with-ionic-studio-and-cloudinary&t=Building%20a%20Fun%20App%20With%20Ionic%20Studio%20and%20Cloudinary%0a)

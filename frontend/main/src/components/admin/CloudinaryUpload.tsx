import { useEffect } from 'react';

import { config } from '@/config/cloudinary';
import { v4 as uuid } from 'uuid';
import { CoverMedia, Post, PostStatus } from '@/models/post.model';
import { Cloudinary, MediaType, MediaSource } from '@/models/media.model';
import { getFunctions, httpsCallable } from 'firebase/functions';
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  Timestamp,
  writeBatch,
} from '@firebase/firestore';
import { getApp } from '@firebase/app';
import { UserInfoExtended } from '@/models/user.model';
import { Video } from '@/models/video.model';
import { DocumentSnapshot, DocumentData } from 'firebase/firestore';

export default function CloudinaryUpload({
  history,
  type,
  user,
  updateContent,
}: {
  history: Post;
  type: MediaType;
  user: UserInfoExtended;
  updateContent: (h: Post) => Promise<Post>;
}): JSX.Element {
  let widget: any = null;
  const functions = getFunctions();
  const app = getApp();
  const firestore = getFirestore(app);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
    script.async = true;
    script.type = 'text/javascript';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  async function fetchCloudinarySignature(cb: any, params: any) {
    try {
      const signature = await (
        await httpsCallable(functions, 'cloudinarysignature').call(
          'params',
          params
        )
      ).data;
      cb(
        Object.assign(
          {
            signature,
            api_key: config.apiKey,
          },
          params
        )
      );
    } catch (err) {
      console.log('error fetching signature');
    }
  }

  const postHistoryMediaCreate = (
    history: Post,
    type: MediaType,
    cloudinary?: Cloudinary,
    video?: Video
  ) => {
    const mediaId = uuid();
    let coverMedia: CoverMedia = { type, source: MediaSource.cloudinary };
    if (cloudinary) {
      coverMedia = {
        thumbnail_url: cloudinary.thumbnail_url,
        path: cloudinary.path,
        mediaId,
        public_id: cloudinary.public_id,
        url: cloudinary.url,
        type,
        source: MediaSource.cloudinary,
      };
    } else if (video) {
      coverMedia = {
        mediaId,
        url: video.url,
        type,
        source: MediaSource.video,
      };
    }

    const batch = writeBatch(firestore);
    const mediaRef = doc(
      firestore,
      `posts/${history.postId}/history/${history.id}/media/${mediaId}`
    );
    batch.set(mediaRef, {
      id: mediaId,
      type,
      cloudinary: cloudinary || null,
      video: video || null,
      createdAt: Timestamp.now(),
    });

    const historyRef = doc(
      firestore,
      `posts/${history.postId}/history/${history.id}`
    );
    batch.set(historyRef, {
      ...history,
      updatedAt: Timestamp.now(),
      updatedBy: user.uid,
      [type === MediaType.photo ? 'coverPhoto' : 'coverVideo']: coverMedia,
    });
    return batch.commit();
  };

  function onUpload() {
    if (typeof window !== 'undefined') {
      const myWindow = window as any;
      if (myWindow.cloudinary) {
        if (widget && !widget.isDestroyed()) {
          widget.destroy();
        }
        widget = myWindow.cloudinary.createUploadWidget(
          {
            cloudName: config.name,
            uploadPreset:
              type === MediaType.photo
                ? config.photoPreset
                : config.videoPreset,
            prepareUploadParams: fetchCloudinarySignature,
          },
          async (error: any, result: any) => {
            if (!error && result && result.event === 'success') {
              const newHistory = await updateContent(history);
              await postHistoryMediaCreate(newHistory, type, result.info);
              widget.destroy();
            }
            if (!error && result && result.event === 'close') {
              widget.destroy();
            }
            if (error) {
              console.log(error);
            }
          }
        );
        widget.open();
      }
    }
  }

  return (
    <>
      <button
        className="flex items-center space-x-1 btn-primary"
        onClick={() => onUpload()}
      >
        <svg
          className="w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>{' '}
        <span>Upload Media</span>
      </button>
    </>
  );
}

import { User } from 'firebase/auth';
import { doc, DocumentReference, setDoc } from 'firebase/firestore';
import { SetStateAction, useEffect, useState } from 'react';
import { useFirestore, useFirestoreDocData } from 'reactfire';

export const CourseProgress = ({
  user,
  courseId,
  sectionId,
  lessonId,
  currentLesson,
  videoProgress,
  setVideoProgress,
}: {
  user: User;
  courseId: string;
  sectionId: string;
  lessonId: string;
  currentLesson: string;
  videoProgress: number;
  setVideoProgress: (value: SetStateAction<number>) => void;
}) => {
  return (
    <>
      {user && user.uid && courseId && sectionId && lessonId && (
        <UserProgress
          user={user}
          courseId={courseId}
          sectionId={sectionId}
          lessonId={lessonId}
          videoProgress={videoProgress}
          currentLesson={currentLesson}
          setVideoProgress={setVideoProgress}
        />
      )}
    </>
  );
};

const UserProgress = ({
  user,
  courseId,
  sectionId,
  lessonId,
  videoProgress,
  currentLesson,
  setVideoProgress,
}: {
  user: User;
  courseId: string;
  sectionId: string;
  lessonId: string;
  currentLesson: string;
  videoProgress: number;
  setVideoProgress: (value: SetStateAction<number>) => void;
}) => {
  const firestore = useFirestore();
  const ref = doc(
    firestore,
    'users',
    user.uid,
    'courses',
    courseId,
    'sections',
    sectionId,
    'lessons',
    lessonId
  ) as unknown as DocumentReference<any>;
  const {
    status,
    data: userProgress,
    error,
  } = useFirestoreDocData<{
    videoProgress?: number;
    manualComplete?: boolean;
    complete?: boolean;
  } | null>(ref);

  const [checked, setChecked] = useState(false);

  const handleManualChecked = () => {
    setChecked(!checked);
    console.log('setting manual checked', checked);

    setDoc(
      ref,
      {
        manualComplete: checked ? null : true,
      },
      { merge: true }
    );
  };

  useEffect(() => {
    if (
      userProgress?.videoProgress &&
      currentLesson.replaceAll('-', '') === lessonId
    ) {
      setVideoProgress(videoProgress || userProgress?.videoProgress || 0);
    }

    if (
      ref &&
      videoProgress &&
      currentLesson.replaceAll('-', '') === lessonId
    ) {
      console.log('setting doc', videoProgress);
      setDoc(
        ref,
        {
          videoProgress,
        },
        { merge: true }
      );
      if (userProgress?.manualComplete || videoProgress > 0.92) {
        setChecked(true);
        console.log('setting checked', true);

        setDoc(
          ref,
          {
            complete: true,
          },
          { merge: true }
        );
      }
    }
  }, [videoProgress, currentLesson, lessonId]);

  return (
    <>
      <div className="flex items-center justify-between w-full gap-2">
        {userProgress && userProgress?.videoProgress ? (
          <ProgressBar
            completed={Number((userProgress?.videoProgress * 100).toFixed())}
          />
        ) : (
          <div className="flex w-full h-8">
            <ProgressBar completed={0} />
          </div>
        )}

        <input
          type="checkbox"
          checked={checked}
          onChange={handleManualChecked}
          className="w-6 h-6 border-2 border-solid rounded-md border-primary-500 text-primary-500 focus:ring-0"
        />
      </div>
    </>
  );
};

const ProgressBar = ({ completed }: { completed: number }) => {
  return (
    <div className="w-full rounded-full bg-basics-200 dark:bg-basics-500 ">
      <div
        className={`flex rounded-full bg-primary-500 ${
          completed > 25 ? 'justify-end' : 'justify-start'
        }`}
        style={{ width: `${completed}%` }}
      >
        <div className="p-2 text-xs font-bold align-middle text-basics-50">{`${completed}%`}</div>
      </div>
    </div>
  );
};

import { config } from '@/config/firebase';
import { UserInfoExtended } from '@/models/user.model';
import { User } from 'firebase/auth';
import { doc, DocumentReference, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useFirestore, useFirestoreDocData } from 'reactfire';

export const CourseProgress = ({
  user,
  courseId,
  sectionId,
  lessonId,
  videoProgress,
  currentLesson,
}: {
  user: User;
  courseId: string;
  sectionId: string;
  lessonId: string;
  videoProgress: number;
  currentLesson: string;
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
}: {
  user: User;
  courseId: string;
  sectionId: string;
  lessonId: string;
  videoProgress: number;
  currentLesson: string;
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
    setDoc(
      ref,
      {
        manualComplete: !checked,
      },
      { merge: true }
    );
  };

  useEffect(() => {
    if (
      ref &&
      videoProgress &&
      currentLesson.replaceAll('-', '') === lessonId
    ) {
      setDoc(
        ref,
        {
          videoProgress,
          complete:
            userProgress?.manualComplete ||
            (userProgress && userProgress?.videoProgress
              ? userProgress?.videoProgress > 0.98
              : false),
        },
        { merge: true }
      );
    }
    setChecked(
      userProgress?.manualComplete ||
        (userProgress && userProgress?.videoProgress
          ? userProgress?.videoProgress > 0.98
          : false)
    );
  }, [ref, videoProgress, userProgress]);

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

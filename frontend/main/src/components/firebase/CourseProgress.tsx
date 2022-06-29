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
      {currentLesson.replaceAll('-', '') === lessonId &&
        user &&
        user.uid &&
        courseId &&
        sectionId &&
        lessonId && (
          <UserProgress
            user={user}
            courseId={courseId}
            sectionId={sectionId}
            lessonId={lessonId}
            videoProgress={videoProgress}
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
}: {
  user: User;
  courseId: string;
  sectionId: string;
  lessonId: string;
  videoProgress: number;
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
    if (ref && videoProgress) {
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

      setChecked(
        userProgress?.manualComplete ||
          (userProgress && userProgress?.videoProgress
            ? userProgress?.videoProgress > 0.98
            : false)
      );
    }
  }, [ref, videoProgress, userProgress]);

  return (
    <>
      {userProgress && userProgress?.videoProgress && (
        <div className="flex justify-between gap-2">
          <div>{(userProgress?.videoProgress * 100).toFixed()}%</div>
          <div>Complete</div>
          <input
            type="checkbox"
            checked={checked}
            onChange={handleManualChecked}
          />
        </div>
      )}
    </>
  );
};

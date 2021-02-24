import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  addCourseSection,
  postHistoryUpdate,
  usersDataObservable,
} from '@/services/api';
import { Post, Section } from '@/models/post.model.ts';
import { take } from 'rxjs/operators';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { UserInfoExtended } from '@/models/user.model';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const arrayMove = require('array-move');

export default function EditPostCourseSettings({
  historyInput,
}: {
  historyInput: Post;
}): JSX.Element {
  const [history, setHistory] = useState<Post>();

  useEffect(() => {
    setHistory(historyInput);
  }, [historyInput]);

  return (
    <>
      <div>
        <label className="flex">
          <input
            type="radio"
            className="mr-2 rounded text-primary-900"
            id="huey"
            name="drone"
            value="huey"
            checked
          />
          <span>Huey</span>
        </label>
      </div>

      <div>
        <label className="flex">
          <input
            type="radio"
            className="mr-2 rounded text-primary-900"
            id="dewey"
            name="drone"
            value="dewey"
          />
          <span>Dewey</span>
        </label>
      </div>
    </>
  );
}

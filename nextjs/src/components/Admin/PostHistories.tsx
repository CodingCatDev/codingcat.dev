import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Link from 'next/link';

import { useUser } from '@/utils/auth/useUser';
import {
  cleanTimestamp,
  postsByUpdatedAtObservable,
  userProfileDataObservable,
} from '@/services/api';
import { Post, PostStatus } from '@/models/post.model';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-purple/theme.css';
import { take } from 'rxjs/operators';
import { UserInfo } from '@/models/userInfo.model';
import { user } from 'rxfire/auth';
import { BehaviorSubject } from 'rxjs';

function PostHistories({ postHistories }: { postHistories: Post[] }) {
  const [histories, setHistories] = useState<
    { post: Post; user: UserInfo }[]
  >();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const postsUpdated = postHistories.map((h) => {
      return { post: cleanTimestamp(h) };
    });
    setHistories(postsUpdated as any);
    setCount(postHistories.length);
    return () => {};
  }, [postHistories]);

  useEffect(() => {
    if (count == 0) {
      return;
    }
    if (histories) {
      const historyUpdate = [...histories];
      histories.map((h, i) => {
        if (h.post.updatedBy) {
          userProfileDataObservable(h.post.updatedBy)
            .pipe(take(1))
            .subscribe((u) => {
              historyUpdate[i].user = u;
              setHistories(historyUpdate);
              setCount(count - 1);
            });
        }
      });
    }
  }, [count]);

  function statusBodyTemplate(rowData: {
    post: { status: {} } | null | undefined;
  }) {
    return (
      <span
        className={
          rowData.post && rowData.post.status === PostStatus.draft
            ? `p-1 rounded-sm bg-gray-300`
            : `p-1 rounded-sm bg-green-400`
        }
      >
        {rowData.post && rowData.post.status}
      </span>
    );
  }

  return (
    <>
      <DataTable
        value={histories}
        scrollable
        scrollHeight="100%"
        className="p-datatable-sm"
      >
        <Column field="post.id" header="ID"></Column>
        <Column header="Status" body={statusBodyTemplate}></Column>
        <Column field="user.displayName" header="Updated By"></Column>
        <Column field="post.updatedAt" header="Updated At"></Column>
      </DataTable>
    </>
  );
}

export default PostHistories;

import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import TimeAgo from 'react-timeago';

import firebase, { getApp } from 'firebase/app';
import { Post, PostStatus } from '@/models/post.model';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-purple/theme.css';
import { take } from 'rxjs/operators';
import { UserInfoExtended } from '@/models/user.model';
import { doc, DocumentReference, getFirestore } from '@firebase/firestore';
import { getDoc } from 'firebase/firestore';

interface PostWithUser extends Post {
  user?: UserInfoExtended | undefined;
}

function PostHistories({
  postHistories,
}: {
  postHistories: PostWithUser[];
}): JSX.Element {
  const [count, setCount] = useState(0);
  const [expandedRows, setExpandedRows] = useState([]);
  const app = getApp();
  const firestore = getFirestore(app);

  useEffect(() => {
    const postsUpdated: {
      post: Post;
      user?: UserInfoExtended;
    }[] = postHistories.map((h) => {
      return { post: h };
    });
    setCount(postHistories.length);
    return () => {
      false;
    };
  }, [postHistories]);

  useEffect(() => {
    if (count == 0) {
      return;
    }
    if (postHistories) {
      const historyUpdate = [...postHistories];
      postHistories.map((h, i) => {
        if (h.updatedBy) {
          getDoc(
            doc(
              firestore,
              `/profiles/${h.updatedBy}`
            ) as DocumentReference<UserInfoExtended>
          ).then((u) => (historyUpdate[i].user = u.data()));
        }
      });
    }
  }, [count, postHistories]);

  function statusBodyTemplate(rowData: Post) {
    return (
      <span
        className={
          rowData && rowData?.status === PostStatus.draft
            ? `p-1 rounded-sm bg-gray-300 text-gray-800`
            : `p-1 rounded-sm bg-green-400 text-green-800`
        }
      >
        {rowData && rowData?.status}
      </span>
    );
  }

  function updatedAtTemplate(rowData: Post) {
    return (
      <span>
        {rowData && rowData?.updatedAt ? (
          <TimeAgo date={rowData?.updatedAt.toDate()} />
        ) : (
          <></>
        )}
      </span>
    );
  }
  function updatedByTemplate(rowData: PostWithUser) {
    const user = rowData?.user;
    return (
      <>
        {user && (
          <div className="flex flex-wrap">
            <div>{user?.displayName ? <>{user.displayName}</> : <></>}</div>
            <div>{user?.email ? <>{user.email}</> : <></>}</div>
          </div>
        )}
      </>
    );
  }
  function restoreTemplate(
    rowData: Post,
    rowInfo: {
      rowIndex: number;
    }
  ) {
    return (
      <>
        {rowInfo.rowIndex > 0 && rowData && rowData?.id ? (
          <span>
            <button className="btn-primary" onClick={() => alert('TODO')}>
              Restore
            </button>
          </span>
        ) : (
          <></>
        )}
      </>
    );
  }

  function rowExpansionTemplate(rowData: Post) {
    return (
      <>
        {rowData && rowData?.excerpt && <div>Excerpt: {rowData.excerpt}</div>}
        {rowData && rowData?.content && <div>Content: {rowData.content}</div>}
      </>
    );
  }

  return (
    <>
      <DataTable
        value={postHistories}
        scrollable
        scrollHeight="800px"
        className="p-datatable-sm"
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data as any)}
        rowExpansionTemplate={rowExpansionTemplate}
      >
        <Column expander style={{ width: '3em' }} />
        <Column field="id" header="ID"></Column>
        <Column header="Status" body={statusBodyTemplate}></Column>
        <Column header="Updated By" field={updatedByTemplate}></Column>
        <Column header="Updated" body={updatedAtTemplate}></Column>
        <Column header="Restore" body={restoreTemplate}></Column>
      </DataTable>
    </>
  );
}

export default PostHistories;

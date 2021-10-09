import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import TimeAgo from 'react-timeago';

import firebase from 'firebase/app';
import { userProfileDataObservable } from '@/services/api';
import { Post, PostStatus } from '@/models/post.model';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-purple/theme.css';
import { take } from 'rxjs/operators';

function PostHistories({
  postHistories,
}: {
  postHistories: Post[];
}): JSX.Element {
  const [histories, setHistories] = useState<
    { post: Post; user?: firebase.UserInfo }[]
  >();
  const [count, setCount] = useState(0);
  const [expandedRows, setExpandedRows] = useState([]);

  useEffect(() => {
    const postsUpdated: {
      post: Post;
      user?: firebase.UserInfo;
    }[] = postHistories.map((h) => {
      return { post: h };
    });
    setHistories(postsUpdated);
    setCount(postHistories.length);
    return () => {
      false;
    };
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
    post: { status: string } | null | undefined;
  }) {
    return (
      <span
        className={
          rowData.post && rowData.post.status === PostStatus.draft
            ? `p-1 rounded-sm bg-gray-300 text-gray-800`
            : `p-1 rounded-sm bg-green-400 text-green-800`
        }
      >
        {rowData.post && rowData.post.status}
      </span>
    );
  }

  function updatedAtTemplate(rowData: { post: Post | null | undefined }) {
    return (
      <span>
        {rowData.post && rowData.post.updatedAt ? (
          <TimeAgo date={rowData.post.updatedAt.toDate()} />
        ) : (
          <></>
        )}
      </span>
    );
  }
  function restoreTemplate(
    rowData: {
      post: Post;
    },
    rowInfo: {
      rowIndex: number;
    }
  ) {
    return (
      <>
        {rowInfo.rowIndex > 0 && rowData.post && rowData.post.id ? (
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

  function rowExpansionTemplate(rowData: {
    post: { content: string } | null | undefined;
  }) {
    return <>{rowData && rowData.post ? <>TODO</> : <>TODO</>}</>;
  }

  return (
    <>
      <DataTable
        value={histories}
        scrollable
        scrollHeight="800px"
        className="p-datatable-sm"
        expandedRows={expandedRows}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onRowToggle={(e) => setExpandedRows(e.data as any)}
        rowExpansionTemplate={rowExpansionTemplate}
      >
        <Column expander style={{ width: '3em' }} />
        <Column field="post.id" header="ID"></Column>
        <Column header="Status" body={statusBodyTemplate}></Column>
        <Column header="Updated By" field="user.displayName"></Column>
        <Column header="Updated" body={updatedAtTemplate}></Column>
        <Column header="Restore" body={restoreTemplate}></Column>
      </DataTable>
    </>
  );
}

export default PostHistories;

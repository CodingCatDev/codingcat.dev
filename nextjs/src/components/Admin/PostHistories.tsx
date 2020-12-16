import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Link from 'next/link';

import { useUser } from '@/utils/auth/useUser';
import { cleanTimestamp, postsByUpdatedAtObservable } from '@/services/api';
import { Post, PostStatus } from '@/models/post.model';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-purple/theme.css';

function PostHistories({ postHistories }: { postHistories: Post[] }) {
  const histories = postHistories.map((h) => cleanTimestamp(h));

  function statusBodyTemplate(rowData: { status: {} | null | undefined }) {
    return (
      <span
        className={
          rowData.status === PostStatus.draft
            ? `p-1 rounded-sm bg-ccd-basics-300`
            : `p-1 rounded-sm bg-ccd-greens-400`
        }
      >
        {rowData.status}
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
        <Column field="id" header="ID"></Column>
        <Column header="Status" body={statusBodyTemplate}></Column>
        <Column field="updatedBy" header="Updated By"></Column>
        <Column field="updatedAt" header="Updated At"></Column>
      </DataTable>
    </>
  );
}

export default PostHistories;

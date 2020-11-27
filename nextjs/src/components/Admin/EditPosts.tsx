import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Link from "next/link";

import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "primereact/resources/themes/saga-purple/theme.css";

import { useUser } from "../../utils/auth/useUser";
import { getPosts } from "../../services/firestore";

function EditPosts({ path }) {
  const { user, logout }: { user: any; logout: any } = useUser();
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    getPosts("posts", 5).then((postRef) =>
      setPosts(
        postRef.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          };
        })
      )
    );
  }, []);

  function postId(rowData) {
    return (
      <Link href={`.${path}/${rowData.id}`}>
        <a className="underline text-ccd-primary-500">{rowData.id}</a>
      </Link>
    );
  }
  function postCategories(rowData) {
    return <span>{rowData.post_categories.join(",")}</span>;
  }
  function postStatus(rowData) {
    return (
      <span
        className={`p-2 capitalize text-green-800 rounded
          ${rowData.post_status === "publish" ? `bg-green-200` : `bg-red`}
          `}
      >
        {rowData.post_status}
      </span>
    );
  }

  return (
    <div>
      <div className="card">
        <DataTable value={posts}>
          <Column field="id" header="Id" body={postId}></Column>
          <Column field="post_title" header="Title"></Column>
          <Column field="post_author" header="Author"></Column>
          <Column
            field="post_categories"
            header="Category"
            body={postCategories}
          ></Column>
          <Column
            field="post_status"
            header="Status"
            body={postStatus}
          ></Column>
          <Column field="updatedAt" header="Updated"></Column>
        </DataTable>
      </div>
    </div>
  );
}

export default EditPosts;

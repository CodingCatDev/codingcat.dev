/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($owner: String) {
    onCreateUser(owner: $owner) {
      id
      username
      createdAt
      updatedAt
      owner
      sites {
        items {
          id
          title
          createdAt
          updatedAt
          version
        }
        nextToken
      }
      posts {
        items {
          id
          post_type
          post_title
          post_name
          post_tags
          post_content
          post_excerpt
          post_featured_image
          comment_status
          ping_status
          comment_count
          createdAt
          updatedAt
          version
          owner
          post_status
        }
        nextToken
      }
      user {
        items {
          id
          content
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($owner: String) {
    onUpdateUser(owner: $owner) {
      id
      username
      createdAt
      updatedAt
      owner
      sites {
        items {
          id
          title
          createdAt
          updatedAt
          version
        }
        nextToken
      }
      posts {
        items {
          id
          post_type
          post_title
          post_name
          post_tags
          post_content
          post_excerpt
          post_featured_image
          comment_status
          ping_status
          comment_count
          createdAt
          updatedAt
          version
          owner
          post_status
        }
        nextToken
      }
      user {
        items {
          id
          content
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($owner: String) {
    onDeleteUser(owner: $owner) {
      id
      username
      createdAt
      updatedAt
      owner
      sites {
        items {
          id
          title
          createdAt
          updatedAt
          version
        }
        nextToken
      }
      posts {
        items {
          id
          post_type
          post_title
          post_name
          post_tags
          post_content
          post_excerpt
          post_featured_image
          comment_status
          ping_status
          comment_count
          createdAt
          updatedAt
          version
          owner
          post_status
        }
        nextToken
      }
      user {
        items {
          id
          content
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
    }
  }
`;
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment($owner: String) {
    onCreateComment(owner: $owner) {
      id
      content
      createdAt
      updatedAt
      user {
        id
        username
        createdAt
        updatedAt
        owner
        sites {
          nextToken
        }
        posts {
          nextToken
        }
        user {
          nextToken
        }
      }
      post {
        id
        post_type
        post_title
        post_name
        post_tags
        post_content
        post_excerpt
        post_featured_image
        comment_status
        ping_status
        comment_count
        createdAt
        updatedAt
        version
        user {
          id
          username
          createdAt
          updatedAt
          owner
        }
        site {
          id
          title
          createdAt
          updatedAt
          version
        }
        owner
        post_status
        comments {
          nextToken
        }
        category {
          nextToken
        }
      }
      owner
    }
  }
`;
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment($owner: String) {
    onUpdateComment(owner: $owner) {
      id
      content
      createdAt
      updatedAt
      user {
        id
        username
        createdAt
        updatedAt
        owner
        sites {
          nextToken
        }
        posts {
          nextToken
        }
        user {
          nextToken
        }
      }
      post {
        id
        post_type
        post_title
        post_name
        post_tags
        post_content
        post_excerpt
        post_featured_image
        comment_status
        ping_status
        comment_count
        createdAt
        updatedAt
        version
        user {
          id
          username
          createdAt
          updatedAt
          owner
        }
        site {
          id
          title
          createdAt
          updatedAt
          version
        }
        owner
        post_status
        comments {
          nextToken
        }
        category {
          nextToken
        }
      }
      owner
    }
  }
`;
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment($owner: String) {
    onDeleteComment(owner: $owner) {
      id
      content
      createdAt
      updatedAt
      user {
        id
        username
        createdAt
        updatedAt
        owner
        sites {
          nextToken
        }
        posts {
          nextToken
        }
        user {
          nextToken
        }
      }
      post {
        id
        post_type
        post_title
        post_name
        post_tags
        post_content
        post_excerpt
        post_featured_image
        comment_status
        ping_status
        comment_count
        createdAt
        updatedAt
        version
        user {
          id
          username
          createdAt
          updatedAt
          owner
        }
        site {
          id
          title
          createdAt
          updatedAt
          version
        }
        owner
        post_status
        comments {
          nextToken
        }
        category {
          nextToken
        }
      }
      owner
    }
  }
`;
export const onCreateCategory = /* GraphQL */ `
  subscription OnCreateCategory {
    onCreateCategory {
      id
      name
      createdAt
      updatedAt
      post {
        id
        post_type
        post_title
        post_name
        post_tags
        post_content
        post_excerpt
        post_featured_image
        comment_status
        ping_status
        comment_count
        createdAt
        updatedAt
        version
        user {
          id
          username
          createdAt
          updatedAt
          owner
        }
        site {
          id
          title
          createdAt
          updatedAt
          version
        }
        owner
        post_status
        comments {
          nextToken
        }
        category {
          nextToken
        }
      }
    }
  }
`;
export const onUpdateCategory = /* GraphQL */ `
  subscription OnUpdateCategory {
    onUpdateCategory {
      id
      name
      createdAt
      updatedAt
      post {
        id
        post_type
        post_title
        post_name
        post_tags
        post_content
        post_excerpt
        post_featured_image
        comment_status
        ping_status
        comment_count
        createdAt
        updatedAt
        version
        user {
          id
          username
          createdAt
          updatedAt
          owner
        }
        site {
          id
          title
          createdAt
          updatedAt
          version
        }
        owner
        post_status
        comments {
          nextToken
        }
        category {
          nextToken
        }
      }
    }
  }
`;
export const onDeleteCategory = /* GraphQL */ `
  subscription OnDeleteCategory {
    onDeleteCategory {
      id
      name
      createdAt
      updatedAt
      post {
        id
        post_type
        post_title
        post_name
        post_tags
        post_content
        post_excerpt
        post_featured_image
        comment_status
        ping_status
        comment_count
        createdAt
        updatedAt
        version
        user {
          id
          username
          createdAt
          updatedAt
          owner
        }
        site {
          id
          title
          createdAt
          updatedAt
          version
        }
        owner
        post_status
        comments {
          nextToken
        }
        category {
          nextToken
        }
      }
    }
  }
`;

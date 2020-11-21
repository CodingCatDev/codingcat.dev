/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateVodAsset = /* GraphQL */ `
  subscription OnCreateVodAsset {
    onCreateVodAsset {
      id
      title
      description
      createdAt
      updatedAt
      video {
        id
        token
        createdAt
        updatedAt
      }
    }
  }
`;
export const onUpdateVodAsset = /* GraphQL */ `
  subscription OnUpdateVodAsset {
    onUpdateVodAsset {
      id
      title
      description
      createdAt
      updatedAt
      video {
        id
        token
        createdAt
        updatedAt
      }
    }
  }
`;
export const onDeleteVodAsset = /* GraphQL */ `
  subscription OnDeleteVodAsset {
    onDeleteVodAsset {
      id
      title
      description
      createdAt
      updatedAt
      video {
        id
        token
        createdAt
        updatedAt
      }
    }
  }
`;
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment($owner: String!) {
    onCreateComment(owner: $owner) {
      id
      content
      post {
        id
        post_type
        post_title
        post_name
        post_tags
        post_content
        post_excerpt
        post_status
        comment_status
        ping_status
        comment_count
        post_featured_image
        blog {
          id
          title
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        comments {
          nextToken
        }
        category {
          nextToken
        }
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment($owner: String!) {
    onUpdateComment(owner: $owner) {
      id
      content
      post {
        id
        post_type
        post_title
        post_name
        post_tags
        post_content
        post_excerpt
        post_status
        comment_status
        ping_status
        comment_count
        post_featured_image
        blog {
          id
          title
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        comments {
          nextToken
        }
        category {
          nextToken
        }
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment($owner: String!) {
    onDeleteComment(owner: $owner) {
      id
      content
      post {
        id
        post_type
        post_title
        post_name
        post_tags
        post_content
        post_excerpt
        post_status
        comment_status
        ping_status
        comment_count
        post_featured_image
        blog {
          id
          title
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        comments {
          nextToken
        }
        category {
          nextToken
        }
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateCategory = /* GraphQL */ `
  subscription OnCreateCategory {
    onCreateCategory {
      id
      name
      post {
        id
        post_type
        post_title
        post_name
        post_tags
        post_content
        post_excerpt
        post_status
        comment_status
        ping_status
        comment_count
        post_featured_image
        blog {
          id
          title
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        comments {
          nextToken
        }
        category {
          nextToken
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateCategory = /* GraphQL */ `
  subscription OnUpdateCategory {
    onUpdateCategory {
      id
      name
      post {
        id
        post_type
        post_title
        post_name
        post_tags
        post_content
        post_excerpt
        post_status
        comment_status
        ping_status
        comment_count
        post_featured_image
        blog {
          id
          title
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        comments {
          nextToken
        }
        category {
          nextToken
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteCategory = /* GraphQL */ `
  subscription OnDeleteCategory {
    onDeleteCategory {
      id
      name
      post {
        id
        post_type
        post_title
        post_name
        post_tags
        post_content
        post_excerpt
        post_status
        comment_status
        ping_status
        comment_count
        post_featured_image
        blog {
          id
          title
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        comments {
          nextToken
        }
        category {
          nextToken
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateVideoObject = /* GraphQL */ `
  subscription OnCreateVideoObject {
    onCreateVideoObject {
      id
      token
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateVideoObject = /* GraphQL */ `
  subscription OnUpdateVideoObject {
    onUpdateVideoObject {
      id
      token
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteVideoObject = /* GraphQL */ `
  subscription OnDeleteVideoObject {
    onDeleteVideoObject {
      id
      token
      createdAt
      updatedAt
    }
  }
`;

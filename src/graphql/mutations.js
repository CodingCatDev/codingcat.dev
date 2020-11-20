/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createBlog = /* GraphQL */ `
  mutation CreateBlog(
    $input: CreateBlogInput!
    $condition: ModelBlogConditionInput
  ) {
    createBlog(input: $input, condition: $condition) {
      id
      title
      posts {
        items {
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
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateBlog = /* GraphQL */ `
  mutation UpdateBlog(
    $input: UpdateBlogInput!
    $condition: ModelBlogConditionInput
  ) {
    updateBlog(input: $input, condition: $condition) {
      id
      title
      posts {
        items {
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
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteBlog = /* GraphQL */ `
  mutation DeleteBlog(
    $input: DeleteBlogInput!
    $condition: ModelBlogConditionInput
  ) {
    deleteBlog(input: $input, condition: $condition) {
      id
      title
      posts {
        items {
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
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const createPost = /* GraphQL */ `
  mutation CreatePost(
    $input: CreatePostInput!
    $condition: ModelPostConditionInput
  ) {
    createPost(input: $input, condition: $condition) {
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
      blog {
        id
        title
        posts {
          nextToken
        }
        createdAt
        updatedAt
      }
      comments {
        items {
          id
          content
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      category {
        items {
          id
          name
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const updatePost = /* GraphQL */ `
  mutation UpdatePost(
    $input: UpdatePostInput!
    $condition: ModelPostConditionInput
  ) {
    updatePost(input: $input, condition: $condition) {
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
      blog {
        id
        title
        posts {
          nextToken
        }
        createdAt
        updatedAt
      }
      comments {
        items {
          id
          content
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      category {
        items {
          id
          name
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const deletePost = /* GraphQL */ `
  mutation DeletePost(
    $input: DeletePostInput!
    $condition: ModelPostConditionInput
  ) {
    deletePost(input: $input, condition: $condition) {
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
      blog {
        id
        title
        posts {
          nextToken
        }
        createdAt
        updatedAt
      }
      comments {
        items {
          id
          content
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      category {
        items {
          id
          name
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const createComment = /* GraphQL */ `
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
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
        blog {
          id
          title
          createdAt
          updatedAt
        }
        comments {
          nextToken
        }
        category {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateComment = /* GraphQL */ `
  mutation UpdateComment(
    $input: UpdateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    updateComment(input: $input, condition: $condition) {
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
        blog {
          id
          title
          createdAt
          updatedAt
        }
        comments {
          nextToken
        }
        category {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment(
    $input: DeleteCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    deleteComment(input: $input, condition: $condition) {
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
        blog {
          id
          title
          createdAt
          updatedAt
        }
        comments {
          nextToken
        }
        category {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const createCategory = /* GraphQL */ `
  mutation CreateCategory(
    $input: CreateCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    createCategory(input: $input, condition: $condition) {
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
        blog {
          id
          title
          createdAt
          updatedAt
        }
        comments {
          nextToken
        }
        category {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateCategory = /* GraphQL */ `
  mutation UpdateCategory(
    $input: UpdateCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    updateCategory(input: $input, condition: $condition) {
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
        blog {
          id
          title
          createdAt
          updatedAt
        }
        comments {
          nextToken
        }
        category {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteCategory = /* GraphQL */ `
  mutation DeleteCategory(
    $input: DeleteCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    deleteCategory(input: $input, condition: $condition) {
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
        blog {
          id
          title
          createdAt
          updatedAt
        }
        comments {
          nextToken
        }
        category {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const createVodAsset = /* GraphQL */ `
  mutation CreateVodAsset(
    $input: CreateVodAssetInput!
    $condition: ModelvodAssetConditionInput
  ) {
    createVodAsset(input: $input, condition: $condition) {
      id
      title
      description
      video {
        id
        token
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateVodAsset = /* GraphQL */ `
  mutation UpdateVodAsset(
    $input: UpdateVodAssetInput!
    $condition: ModelvodAssetConditionInput
  ) {
    updateVodAsset(input: $input, condition: $condition) {
      id
      title
      description
      video {
        id
        token
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteVodAsset = /* GraphQL */ `
  mutation DeleteVodAsset(
    $input: DeleteVodAssetInput!
    $condition: ModelvodAssetConditionInput
  ) {
    deleteVodAsset(input: $input, condition: $condition) {
      id
      title
      description
      video {
        id
        token
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const createVideoObject = /* GraphQL */ `
  mutation CreateVideoObject(
    $input: CreateVideoObjectInput!
    $condition: ModelvideoObjectConditionInput
  ) {
    createVideoObject(input: $input, condition: $condition) {
      id
      token
      createdAt
      updatedAt
    }
  }
`;
export const updateVideoObject = /* GraphQL */ `
  mutation UpdateVideoObject(
    $input: UpdateVideoObjectInput!
    $condition: ModelvideoObjectConditionInput
  ) {
    updateVideoObject(input: $input, condition: $condition) {
      id
      token
      createdAt
      updatedAt
    }
  }
`;
export const deleteVideoObject = /* GraphQL */ `
  mutation DeleteVideoObject(
    $input: DeleteVideoObjectInput!
    $condition: ModelvideoObjectConditionInput
  ) {
    deleteVideoObject(input: $input, condition: $condition) {
      id
      token
      createdAt
      updatedAt
    }
  }
`;

/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
          post_basename
          post_tags
          post_content
          post_excerpt
          post_featured_image
          comment_status
          ping_status
          comment_count
          post_permalink
          post_author
          post_thumbnail
          post_formats
          post_preview
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
          post_basename
          post_tags
          post_content
          post_excerpt
          post_featured_image
          comment_status
          ping_status
          comment_count
          post_permalink
          post_author
          post_thumbnail
          post_formats
          post_preview
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
          post_basename
          post_tags
          post_content
          post_excerpt
          post_featured_image
          comment_status
          ping_status
          comment_count
          post_permalink
          post_author
          post_thumbnail
          post_formats
          post_preview
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
export const createSite = /* GraphQL */ `
  mutation CreateSite(
    $input: CreateSiteInput!
    $condition: ModelSiteConditionInput
  ) {
    createSite(input: $input, condition: $condition) {
      id
      title
      createdAt
      updatedAt
      version
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
      posts {
        items {
          id
          post_type
          post_title
          post_basename
          post_tags
          post_content
          post_excerpt
          post_featured_image
          comment_status
          ping_status
          comment_count
          post_permalink
          post_author
          post_thumbnail
          post_formats
          post_preview
          createdAt
          updatedAt
          version
          owner
          post_status
        }
        nextToken
      }
    }
  }
`;
export const updateSite = /* GraphQL */ `
  mutation UpdateSite(
    $input: UpdateSiteInput!
    $condition: ModelSiteConditionInput
  ) {
    updateSite(input: $input, condition: $condition) {
      id
      title
      createdAt
      updatedAt
      version
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
      posts {
        items {
          id
          post_type
          post_title
          post_basename
          post_tags
          post_content
          post_excerpt
          post_featured_image
          comment_status
          ping_status
          comment_count
          post_permalink
          post_author
          post_thumbnail
          post_formats
          post_preview
          createdAt
          updatedAt
          version
          owner
          post_status
        }
        nextToken
      }
    }
  }
`;
export const deleteSite = /* GraphQL */ `
  mutation DeleteSite(
    $input: DeleteSiteInput!
    $condition: ModelSiteConditionInput
  ) {
    deleteSite(input: $input, condition: $condition) {
      id
      title
      createdAt
      updatedAt
      version
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
      posts {
        items {
          id
          post_type
          post_title
          post_basename
          post_tags
          post_content
          post_excerpt
          post_featured_image
          comment_status
          ping_status
          comment_count
          post_permalink
          post_author
          post_thumbnail
          post_formats
          post_preview
          createdAt
          updatedAt
          version
          owner
          post_status
        }
        nextToken
      }
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
      post_basename
      post_tags
      post_content
      post_excerpt
      post_featured_image
      comment_status
      ping_status
      comment_count
      post_permalink
      post_author
      post_thumbnail
      post_formats
      post_preview
      createdAt
      updatedAt
      version
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
      site {
        id
        title
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
        posts {
          nextToken
        }
      }
      owner
      post_status
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
      post_basename
      post_tags
      post_content
      post_excerpt
      post_featured_image
      comment_status
      ping_status
      comment_count
      post_permalink
      post_author
      post_thumbnail
      post_formats
      post_preview
      createdAt
      updatedAt
      version
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
      site {
        id
        title
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
        posts {
          nextToken
        }
      }
      owner
      post_status
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
      post_basename
      post_tags
      post_content
      post_excerpt
      post_featured_image
      comment_status
      ping_status
      comment_count
      post_permalink
      post_author
      post_thumbnail
      post_formats
      post_preview
      createdAt
      updatedAt
      version
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
      site {
        id
        title
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
        posts {
          nextToken
        }
      }
      owner
      post_status
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
        post_basename
        post_tags
        post_content
        post_excerpt
        post_featured_image
        comment_status
        ping_status
        comment_count
        post_permalink
        post_author
        post_thumbnail
        post_formats
        post_preview
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
export const updateComment = /* GraphQL */ `
  mutation UpdateComment(
    $input: UpdateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    updateComment(input: $input, condition: $condition) {
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
        post_basename
        post_tags
        post_content
        post_excerpt
        post_featured_image
        comment_status
        ping_status
        comment_count
        post_permalink
        post_author
        post_thumbnail
        post_formats
        post_preview
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
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment(
    $input: DeleteCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    deleteComment(input: $input, condition: $condition) {
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
        post_basename
        post_tags
        post_content
        post_excerpt
        post_featured_image
        comment_status
        ping_status
        comment_count
        post_permalink
        post_author
        post_thumbnail
        post_formats
        post_preview
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
export const createCategory = /* GraphQL */ `
  mutation CreateCategory(
    $input: CreateCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    createCategory(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
      post {
        id
        post_type
        post_title
        post_basename
        post_tags
        post_content
        post_excerpt
        post_featured_image
        comment_status
        ping_status
        comment_count
        post_permalink
        post_author
        post_thumbnail
        post_formats
        post_preview
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
export const updateCategory = /* GraphQL */ `
  mutation UpdateCategory(
    $input: UpdateCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    updateCategory(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
      post {
        id
        post_type
        post_title
        post_basename
        post_tags
        post_content
        post_excerpt
        post_featured_image
        comment_status
        ping_status
        comment_count
        post_permalink
        post_author
        post_thumbnail
        post_formats
        post_preview
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
export const deleteCategory = /* GraphQL */ `
  mutation DeleteCategory(
    $input: DeleteCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    deleteCategory(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
      post {
        id
        post_type
        post_title
        post_basename
        post_tags
        post_content
        post_excerpt
        post_featured_image
        comment_status
        ping_status
        comment_count
        post_permalink
        post_author
        post_thumbnail
        post_formats
        post_preview
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
export const createVodAsset = /* GraphQL */ `
  mutation CreateVodAsset(
    $input: CreateVodAssetInput!
    $condition: ModelvodAssetConditionInput
  ) {
    createVodAsset(input: $input, condition: $condition) {
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
export const updateVodAsset = /* GraphQL */ `
  mutation UpdateVodAsset(
    $input: UpdateVodAssetInput!
    $condition: ModelvodAssetConditionInput
  ) {
    updateVodAsset(input: $input, condition: $condition) {
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
export const deleteVodAsset = /* GraphQL */ `
  mutation DeleteVodAsset(
    $input: DeleteVodAssetInput!
    $condition: ModelvodAssetConditionInput
  ) {
    deleteVodAsset(input: $input, condition: $condition) {
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

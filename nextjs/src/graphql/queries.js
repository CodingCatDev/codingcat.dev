/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const searchPosts = /* GraphQL */ `
  query SearchPosts(
    $filter: SearchablePostFilterInput
    $sort: SearchablePostSortInput
    $limit: Int
    $nextToken: String
    $from: Int
  ) {
    searchPosts(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
    ) {
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
      nextToken
      total
    }
  }
`;
export const getBlog = /* GraphQL */ `
  query GetBlog($id: ID!) {
    getBlog(id: $id) {
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
          post_featured_image
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
export const listBlogs = /* GraphQL */ `
  query ListBlogs(
    $filter: ModelBlogFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBlogs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        posts {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
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
        posts {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
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
export const listPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
      nextToken
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
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
export const listComments = /* GraphQL */ `
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const getCategory = /* GraphQL */ `
  query GetCategory($id: ID!) {
    getCategory(id: $id) {
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
export const listCategorys = /* GraphQL */ `
  query ListCategorys(
    $filter: ModelCategoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCategorys(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getVodAsset = /* GraphQL */ `
  query GetVodAsset($id: ID!) {
    getVodAsset(id: $id) {
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
export const listVodAssets = /* GraphQL */ `
  query ListVodAssets(
    $filter: ModelvodAssetFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listVodAssets(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const listVideoObjects = /* GraphQL */ `
  query ListVideoObjects(
    $filter: ModelvideoObjectFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listVideoObjects(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        token
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getVideoObject = /* GraphQL */ `
  query GetVideoObject($id: ID!) {
    getVideoObject(id: $id) {
      id
      token
      createdAt
      updatedAt
    }
  }
`;

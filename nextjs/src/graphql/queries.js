/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const listSites = /* GraphQL */ `
  query ListSites(
    $filter: ModelSiteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSites(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getSite = /* GraphQL */ `
  query GetSite($id: ID!) {
    getSite(id: $id) {
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
      nextToken
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
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
        createdAt
        updatedAt
        user {
          id
          username
          createdAt
          updatedAt
          owner
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
          owner
          post_status
        }
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
          owner
          post_status
        }
      }
      nextToken
    }
  }
`;

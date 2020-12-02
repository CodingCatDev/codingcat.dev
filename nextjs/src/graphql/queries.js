/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const postsByPostTypePublished = /* GraphQL */ `
  query PostsByPostTypePublished(
    $post_type: String
    $post_publish_datetime: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAPIFilterInput
    $limit: Int
    $nextToken: String
  ) {
    postsByPostTypePublished(
      post_type: $post_type
      post_publish_datetime: $post_publish_datetime
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
        post_publish_datetime
        site_title
        user_username
        user_sites
        user_posts
        user_user
        comment_content
        comment_user
        category_title
        category_description
        createdAt
        updatedAt
        version
        owner
        post_status
      }
      nextToken
    }
  }
`;
export const postsByPermalink = /* GraphQL */ `
  query PostsByPermalink(
    $post_permalink: String
    $sortDirection: ModelSortDirection
    $filter: ModelAPIFilterInput
    $limit: Int
    $nextToken: String
  ) {
    postsByPermalink(
      post_permalink: $post_permalink
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
        post_publish_datetime
        site_title
        user_username
        user_sites
        user_posts
        user_user
        comment_content
        comment_user
        category_title
        category_description
        createdAt
        updatedAt
        version
        owner
        post_status
      }
      nextToken
    }
  }
`;
export const getApi = /* GraphQL */ `
  query GetApi($id: ID!) {
    getAPI(id: $id) {
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
      post_publish_datetime
      site_title
      user_username
      user_sites
      user_posts
      user_user
      comment_content
      comment_user
      category_title
      category_description
      createdAt
      updatedAt
      version
      owner
      post_status
    }
  }
`;
export const listApIs = /* GraphQL */ `
  query ListApIs(
    $filter: ModelAPIFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAPIs(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
        post_publish_datetime
        site_title
        user_username
        user_sites
        user_posts
        user_user
        comment_content
        comment_user
        category_title
        category_description
        createdAt
        updatedAt
        version
        owner
        post_status
      }
      nextToken
    }
  }
`;

var AWS = require('aws-sdk');
var fs = require('fs');
var uuid = require('uuid');
var path = require('path');

AWS.config.update({
  region: 'us-east-1',
});

var docClient = new AWS.DynamoDB.DocumentClient();

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question('Enter Table Name: ', (tableName) => {
  // API-ta3xuq6qtfbxtasib7i52xbn7e-dev
  console.log('Importing data into DynamoDB. Please wait.');
  var posts = JSON.parse(
    fs.readFileSync(path.join(__dirname, './posts.json'), 'utf8')
  );
  var postsMd = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../markdown/posts/_posts.json'),
      'utf8'
    )
  );
  for (const [key, post] of Object.entries(posts)) {
    let postMd;
    for (const [mdKey, md] of Object.entries(postsMd)) {
      if (key === mdKey) {
        postMd = md;
        break;
      }
    }
    if (postMd == undefined) {
      break;
    }
    var params = {
      TableName: tableName,
      Item: {
        id: uuid.v4(),
        postSiteId: 'd6ffe0b6-a8ab-4ba2-8204-861b74633126',
        createdAt: post.date,
        updatedAt: post.date,
        post_publish_datetime: post.date,
        post_title: post.title,
        post_status: post.status,
        post_permalink: post.permalink,
        post_author: post.author,
        post_excerpt: post.excerpt,
        post_type: post.type,
        post_thumbnail: post.thumbnail,
        post_categories: post.category,
        post_tags: post.tag,
        post_formats: post.post_format,
        post_preview: post.preview,
        post_content: postMd.content,
        ping_status: false,
        comment_count: 0,
        post_iso8601Date: post.iso8601Date,
        post_basename: post.basename,
        post_featured_image: post.thumbnail,
      },
    };

    docClient.put(params, (err, data) => {
      if (err) {
        console.error(
          'Unable to add data',
          post.title,
          '. Error JSON:',
          JSON.stringify(err, null, 2)
        );
      } else {
        console.log('PutItem succeeded:', post.title);
      }
    });
  }
  readline.close();
});

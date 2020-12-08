const admin = require("firebase-admin");
// serviceAccountKey.json can be generated in Firebase Console.
const serviceAccountKey = require("../../../serviceAccountKey.json");
const seed = require("firestore-seed");
var uuid = require("uuid");
var path = require("path");
var fs = require("fs");

// Initialize firebase-admin.
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
  databaseURL: "https://dev-codingcat-dev.firebaseio.com",
  storageBucket: "dev-codingcat-dev.appspot.com",
});

["courses"].forEach((postType) => {
  var posts = JSON.parse(
    fs.readFileSync(path.join(__dirname, `../posts/${postType}.json`), "utf8")
  );
  // var postsMd = JSON.parse(
  //   fs.readFileSync(
  //     path.join(__dirname, `../markdown/${postType}/_${postType}.json`),
  //     "utf8"
  //   )
  // );

  const postDocs = [];
  for (const [key, post] of Object.entries(posts)) {
    // let postMd;
    // for (const [mdKey, md] of Object.entries(postsMd)) {
    //   if (key === mdKey) {
    //     postMd = md;
    //     break;
    //   }
    // }
    // if (postMd == undefined) {
    //   break;
    // }

    postDocs.push(
      seed.doc(uuid.v4(), {
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
        // post_formats: post.post_format,
        post_preview: post.preview,
        post_content: post.content,
        ping_status: false,
        comment_count: 0,
        post_iso8601Date: post.iso8601Date,
        post_basename: post.basename,
        post_featured_image: post.thumbnail,
      })
    );
  }

  console.log(postType);
  console.log(postDocs.length);
  // Import seeds.
  const postCollection = seed.collection(`${postType}`, postDocs);

  postCollection
    .importDocuments(admin)
    .then(() => {
      console.log("Successfully imported documents.");
    })
    .catch((e) => {
      console.log("Failed to import documents: " + e);
    });
});

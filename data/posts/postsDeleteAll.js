const TABLE = process.env.ATLAS_TABLE || "API-ta3xuq6qtfbxtasib7i52xbn7e-dev";
const PROFILE = process.env.PROFILE || "default";

var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
});

if (!TABLE || !PROFILE) {
  throw new Error("Dude come on add your table and profile!");
}

var creds = new AWS.SharedIniFileCredentials({ profile: PROFILE });
AWS.config.credentials = creds;

var docClient = new AWS.DynamoDB.DocumentClient();

deletePosts();

async function deletePosts() {
  const posts = await getAllDeleteData();
  console.log(`Deleting ${posts.length}`);

  posts.forEach(function (obj, i) {
    console.log("deleting", obj.id);
    var params = {
      TableName: TABLE,
      Key: buildKey(obj),
      ReturnValues: "NONE",
      ReturnConsumedCapacity: "NONE",
      ReturnItemCollectionMetrics: "NONE",
    };

    docClient.delete(params, function (err, data) {
      if (err) console.log(JSON.stringify(err));
    });
  });
}
function getAllDeleteData() {
  return new Promise(async (resolve, reject) => {
    let deleteData = [];
    let exclusiveStartKey;
    while (true) {
      const data = await getDeleteData(exclusiveStartKey);
      console.log(`Found ${data.Count}`);
      deleteData = [...deleteData, ...data.Items];
      //   if (typeof data.LastEvaluatedKey != "undefined") {
      //     console.log(`Starting next search`, data.LastEvaluatedKey);
      //     exclusiveStartKey = data.LastEvaluatedKey;
      //   } else {
      resolve(deleteData);
      break;
      //   }
    }
  });
}
function getDeleteData(exclusiveStartKey) {
  return new Promise((resolve, reject) => {
    docClient.scan(
      {
        TableName: TABLE,
        ExclusiveStartKey: exclusiveStartKey,
      },
      (err, data) => {
        if (err) console.log(err);
        else resolve(data);
      }
    );
  });
}
function buildKey(obj) {
  var key = {};
  key["id"] = obj["id"];
  return key;
}

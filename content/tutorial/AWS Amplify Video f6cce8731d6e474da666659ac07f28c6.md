---
cloudinary_convert: false
cover: htts://media.codingcat.dev/image/upload/v1610334436/ccd-cloudinary/nepnvay0yphf0dgg8ci6.png
excerpt: How to easily add Video for Livestreaming or Video on Demand to your next Amplify project.
hashnode: https://hashnode.codingcat.dev/tutorial-aws-amplify-video
preview: https://codingcat.dev/api/preview?secret=7tjQhb1qQlS3FtyV3b0I&selectionType=tutorial&selectionSlug=aws-amplify-video&_id=f6cce8731d6e474da666659ac07f28c6
published: published
slug: aws-amplify-video
start: May 31, 2022
title: AWS Amplify Video
youtube: https://youtu.be/vM_YoZbLQQ0
---

> AWS Account is required for this lesson. You may (and probably will) incur fees associated with these activities. Livestreaming is VERY expensive so be careful!
> 

## Startup

Please make sure that you see the prerequisites, the are Node, NPM and Git. [https://docs.amplify.aws/start/getting-started/installation/q/integration/react](https://docs.amplify.aws/start/getting-started/installation/q/integration/react)

### Installing Amplify

Make sure you install amplify globally. This will allow you to execute commands within your project.

```bash
npm install @aws-amplify/cli@latest -g
```

### Configuring Amplify with AWS

Run the below command to add configuration to for AWS.

```bash
amplify configure
```

You will need to finish adding the required role for your amplify CLI to connect with AWS..

### Initializing Project

> If you prefer to follow the guide see the link in the React section.
> 

```bash
amplify init
```

This is the setup that I provided for using VSCode and creating a React

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/eqryxullhupbx6fqtl1m.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/eqryxullhupbx6fqtl1m.png)

## React setup

I would recommend this guide for fully setting up a React project.

[https://docs.amplify.aws/start/getting-started/setup/q/integration/react#initialize-a-new-backend](https://docs.amplify.aws/start/getting-started/setup/q/integration/react#initialize-a-new-backend)

`npx` is an npm command that will fetch the necessary dependencies and create a React Application.

```bash
npx create-react-app react-amplified
cd react-amplified
```

## Amplify Add Video

At the time of writing this lesson there are two options that you can use for video, Livestream and Video on Demand (VOD). VOD is currently still in beta but it still produces a great streaming setup for VOD.

### Livestream

> I just want to repeat, Livestream is a cool experiement but SUPER expensive to run!
> 

For adding Livestream you can accept all of the defaults (I used a custom name for the project).

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/xjbuxdj1l7ozpdw8zebr.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/xjbuxdj1l7ozpdw8zebr.png)

Whenever you add new services to Amplify you then need to push them to AWS. Amplify uses Cloudformation to create all of the required services. The key item that is created for Livestream is AWS Elemental MediaLive.

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/stboiq6bb77qlycakn5g.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/stboiq6bb77qlycakn5g.png)

You will be able to find a great amount of detail from this link [https://aws.amazon.com/medialive/](https://aws.amazon.com/medialive/). This image represents exactly how we are utilizing the service. Our input source is OBS instead of a camera like depicted on the left.

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/l3qxsmypayxy0yiegfzg.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/l3qxsmypayxy0yiegfzg.png)

## Video on Demand (VOD)

Probably the best explantion for what is going to happen for this part of the lesson is described in the GitHub Issue for VOD. [https://github.com/awslabs/amplify-video/issues/4](https://github.com/awslabs/amplify-video/issues/4)

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/lf33ggz1fsrcfwlypjs1.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/lf33ggz1fsrcfwlypjs1.png)

This is very similar to the larger image diagram that AWS has listed, however it is much simpler to follow.

[https://aws.amazon.com/solutions/implementations/video-on-demand-on-aws/](https://aws.amazon.com/solutions/implementations/video-on-demand-on-aws/)

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/kse1yejh02xcqktxmngr.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/kse1yejh02xcqktxmngr.png)

### Adding VOD to Amplify

We will first use amplify to add VOD by running the below command

```bash
amplify video add
```

In the video I choose to add the GraphQL option, but if you would rather keep things simple you can choose these options to ignore it.

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/brxjazwgwgk9u81t1lhj.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/brxjazwgwgk9u81t1lhj.png)

Now that VOD resources have been added to the project you can push them to aws.

```bash
amplify push
```

You should see a similar message (depending on the changes you have made it could add api).

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/d65ozuyqrmuhasuliqmr.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/d65ozuyqrmuhasuliqmr.png)

Once this operation completes you should receive a message like below where your S3 buckets are listed for testing out the process. Select yes to overwrite, you will use this URL from the configuration in your React app.

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/t7wkoptwyrawuz3qlve3.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/t7wkoptwyrawuz3qlve3.png)

## Showing Videos In React

Now that you have locations for both Livestreaming and VOD, we can update `App.js` to include a package called `video.js`.

```bash
npm i video.js
```

Once this package is installed we can use it within our React app.

```bash
import React from "react";
import logo from "./logo.svg";
import "./App.css";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import awsvideoconfig from "./aws-video-exports";

class VideoPlayer extends React.Component {
  componentDidMount() {
    this.player = videojs(this.videoNode, this.props);
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  render() {
    return (
      <div>
        <div data-vjs-player>
          <video
            ref={(node) => {
              this.videoNode = node;
            }}
            className="video-js"
          />
        </div>
      </div>
    );
  }
}

const videoJsOptions = {
  autoplay: true,
  controls: true,
  sources: [
    {
      src: awsvideoconfig.awsOutputLiveLL,
    },
  ],
};

const videoOnDemandJsOptions = {
  autoplay: true,
  controls: true,
  sources: [
    {
      src: https://${awsvideoconfig.awsOutputVideo}/mediaConvertTest/mediaConvertTest.m3u8,
    },
  ],
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <VideoPlayer {...videoJsOptions} />
        <VideoPlayer {...videoOnDemandJsOptions} />
      </header>
    </div>
  );
}

export default App;

```

Above you will notice two configruations, videoJsOptions for our Livestream and videOnDemanJsOptions for our VOD. Because I was manually uploading a test file called mediaConvertTest I hardcoded this file directly in the VOD.I have added this file to the GitHub repo for your testing as well, it is located here: `TestVideo/mediaConvertTest.mov`

## Running VOD conversion

In order to start the process of running Media Convert you will need to upload the test file to your S3 bucket it should have the word input within S3.

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/lerlbapelbtxuqj6jlol.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/lerlbapelbtxuqj6jlol.png)

It will then trigger a Lambda to start Media Convert, you can see what events are subscribed on the properties tab in S3.

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/wrp9irrhhgrzylpqgx3d.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/wrp9irrhhgrzylpqgx3d.png)

This Lambda should have the [yourprojectname]-dev-inputWatcher

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/l3nzmpxbqbtbbozlhn16.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/l3nzmpxbqbtbbozlhn16.png)

You can see in the image above how the trigger is creating a new MediaConvert Job. Below is the full code for the Lambda.

```bash
// Load the AWS SDK for Node.js
// eslint-disable-next-line import/no-extraneous-dependencies
/* eslint-disable */
const AWS = require('aws-sdk');
/* eslint-enable */
const jobSettings = require('./settings.json');
// Set the region

exports.handler = async (event) => {
  AWS.config.update({ region: event.awsRegion });
  console.log(event);
  if (event.Records[0].eventName.includes('ObjectCreated')) {
    await createJob(event.Records[0].s3);
    const response = {
      statusCode: 200,
      body: JSON.stringify(Transcoding your file: ${event.Records[0].s3.object.key}),
    };
    return response;
  }
};

// Function to submit job to Elemental MediaConvert
async function createJob(eventObject) {
  let mcClient = new AWS.MediaConvert();
  if (!AWS.config.mediaconvert) {
    try {
      const endpoints = await mcClient.describeEndpoints().promise();
      AWS.config.mediaconvert = { endpoint: endpoints.Endpoints[0].Url };
      // Override so config applies
      mcClient = new AWS.MediaConvert();
    } catch (e) {
      console.log(e);
      return;
    }
  }

  const queueParams = {
    Name: 'Default', /* required */
  };
  const AddedKey = eventObject.object.key;
  // Get the name of the file passed in the event without the extension
  const FileName = AddedKey.split('.').slice(0, -1).join('.');
  const Bucket = eventObject.bucket.name;
  const outputBucketName = process.env.OUTPUT_BUCKET;

  // Set the output to have the filename (without extension) as a folder
  jobSettings.OutputGroups[0].OutputGroupSettings.HlsGroupSettings.Destination = s3://${outputBucketName}/${FileName}/;
  jobSettings.Inputs[0].FileInput = s3://${Bucket}/${AddedKey};

  let queueARN = '';
  if (process.env.QUEUE_ARN) {
    queueARN = process.env.QUEUE_ARN;
  } else {
    const q = await mcClient.getQueue(queueParams, (err, data) => {
      if (err) console.log(err, err.stack); // an error occurred
      else console.log(data);
    }).promise();
    queueARN = q.Queue.Arn;
  }

  const jobParams = {
    JobTemplate: process.env.ARN_TEMPLATE,
    Queue: queueARN,
    UserMetadata: {},
    Role: process.env.MC_ROLE,
    Settings: jobSettings,
  };
  await mcClient.createJob(jobParams).promise();
}
```

Within Media Convert you should see a job has started, and hopefully completed.

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/qaavyhrbcctxasrylmpx.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/qaavyhrbcctxasrylmpx.png)

If you select one of those jobs you will find the input and outputs in the summary.

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/ucmibhr7mwqlvrwlwuue.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/ucmibhr7mwqlvrwlwuue.png)

Now you will find that exact structure in your output S3 bucket.

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/hwxd5brgmyyafcqozrsg.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/hwxd5brgmyyafcqozrsg.png)

If you open that "folder" you can see that there are several files listed that the conversion created.

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/blla8h1gmeuncxkwwj58.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/blla8h1gmeuncxkwwj58.png)

The URL to the top one is what we will be using for the example.

### Showing VOD

Now that you have a VOD file in S3 you will view this file being served through Cloud Front which is Amazon's Global CDN. The URL can be found in `src/aws-video-exports.js`. With the full solution in the App.js file for React you will now see the VOD file playing (you may need to refresh).

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/gihpare5n0ofngwyxtza.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/gihpare5n0ofngwyxtza.png)

## Final Thoughts

I have a message out to the labs team on GitHub about the next triggers. I believe what they are trying to accomplish next is to take the Lambda form the output file and store all of the meta-data into DynamoDB which can then be served through our GraphQL API. I know this is for sure possible and if I don't hear back I will implement my own for the full app. So far this beta version is really awesome though!
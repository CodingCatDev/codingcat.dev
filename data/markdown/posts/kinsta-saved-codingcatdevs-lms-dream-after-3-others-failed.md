---
title: "Kinsta saved CodingCatDev's LMS dream after 3 others failed!"
date: "2020-11-10"
---

[![Kinsta we love developers](https://res.cloudinary.com/ajonp/images/v1605119203/ccd-cloudinary/600x300-developers-light/600x300-developers-light.jpg)](https://kinsta.com?kaid=XIIHFPADWOKE)

After two weeks of moving CodingCatDev from Kinsta to WPEngine to Flywheel, and AWS we are back on Kinsta.

## Kinsta Plan

I am still not sure if we will need the [Business 1 Plan](https://kinsta.com/plans/) but looking at the options and the fact I was hosting other sites I decided to consolidate. I then moved one site with the free migration offering and another old, simple site I moved myself.

[![](https://res.cloudinary.com/ajonp/images/w_1024,h_681,c_scale/v1604999580/ccd-cloudinary/image_1693464a5/image-1024x681.png)](https://kinsta.com/plans/?kaid=XIIHFPADWOKE)

Kinsta Business Plan

The great thing is that Kinsta Business also has 3 Premium migration credits as well, which will allow me to bring on two additional hosting sites. I have a couple in the pipeline so hopefully that will come soon enough and then we can push towards the next tier.

[![](https://res.cloudinary.com/ajonp/images/v1604999845/ccd-cloudinary/image_1696b0d3e/image_1696b0d3e.png)](https://kinsta.com/knowledgebase/wordpress-migrations/?kaid=XIIHFPADWOKE)

Free Migrations

One of the biggest reasons that I chose Business 1 was that it was the first plan that allows for 4 php workers, which I think is the reason for such great performance while running our new [BuddyBoss](https://www.buddyboss.com/) based [LearnDash](https://learndash.idevaffiliate.com/976.html) site.

[![](https://res.cloudinary.com/ajonp/images/w_1024,h_566,c_scale/v1604999581/ccd-cloudinary/image-1_169428277/image-1-1024x566.png)](https://kinsta.com/plans/?kaid=XIIHFPADWOKE)

Kinsta PHP workers per site

### Kinsta is on Google Cloud Platform

![Kinsta GCP](https://res.cloudinary.com/ajonp/images/v1605119727/ccd-cloudinary/300x600-optimized-dark/300x600-optimized-dark.jpg)

[https://kinsta.com/blog/google-cloud-hosting/?kaid=XIIHFPADWOKE](https://kinsta.com/blog/google-cloud-hosting/?kaid=XIIHFPADWOKE)

I personally love Google Cloud Platform since I am a Firebase GDE! Here are all the locations that you can choose from. Find out more detail in [Top 7 Advantages of Choosing Google Cloud Hosting](https://kinsta.com/blog/google-cloud-hosting/?kaid=XIIHFPADWOKE)

You are free to choose from the following 24 [data centers](https://kinsta.com/knowledgebase/best-data-center/) for your WordPress websites:

1. Council Bluffs, Iowa, USA (us-central1)
2. St. Ghislain, Belgium (europe-west1)
3. Changhua County, Taiwan (asia-east1)
4. Sydney, Australia (australia-southeast1)
5. The Dalles, Oregon, USA (us-west1)
6. Salt Lake City, USA (us-west3)
7. Ashburn, Virginia, USA (us-east4)
8. Moncks Corner, South Carolina, USA (us-east1)
9. São Paulo, Brazil (southamerica-east1)
10. London, UK (europe-west2)
11. Frankfurt, Germany (europe-west3)
12. Jurong West, Singapore (asia-southeast1)
13. Tokyo, Japan (asia-northeast1)
14. Mumbai, India (asia-south1)
15. Montréal, Canada (northamerica-northeast1)
16. Eemshaven, Netherlands (europe-west4)
17. Hamina, Finland (europe-north1)
18. Los Angeles, California (us-west2)
19. Hong Kong (asia-east2)
20. Zürich, Switzerland (europe-west6)
21. Osaka, Japan (asia-northeast2)
22. Seoul, South Korea (asia-northeast3)
23. Las Vegas, Nevada, USA (us-west4)
24. Jakarta, Indonesia (asia-southeast2)

## WPEngine

Initially I thought I could get better performance at a lower cost and I thought I might utilize Genesis Framework which is included to see some real gains on the site. What I found was without a tailored LearnDash and BBPress explicit theme this became very difficult. While I liked what I was experiencing I wasn't getting the gains that I had hoped for and I found their admin interface difficult to use.

![](https://res.cloudinary.com/ajonp/images/w_874,h_1024,c_scale/v1605001356/ccd-cloudinary/image_169809906/image-874x1024.png)

WP Enginge Pricing

## Flywheel (getflywheel)

After digging in some more I read that [WP Engine](https://wpengine.com/blog/wp-engine-to-acquire-flywheel/) acquired [Flywheel](https://getflywheel.com/) and that they were offering some amazing pricing for their tiny plan. When I first looked into this I thought this would be great to do some initial testing. Flywheel has really [competitive base plans](https://getflywheel.com/pricing/) that I think would work really well for a static Wordpress site that just needs some solid SEO and fast CDN, but CodingCatDev is a very dynamic site that needs a lot of CPU, memory and PHP workers.

![](https://res.cloudinary.com/ajonp/images/w_1024,h_973,c_scale/v1605001549/ccd-cloudinary/image_17002c4f8/image-1024x973.png)

Flywheel Pricing

What irritated me the most about the Flywheel is that the seemed to hide aspects of their infrastructure from me, they placed arbitrary limits on something that should be so simple. As you can see here they too are hosted on Google Cloud Platform and based on this diagram I was given should have a compelling and solid solution. Unfortunately after requesting logs to be emailed to myself for the 10th time I ultimately gave up on this hosting dream.

![](https://res.cloudinary.com/ajonp/images/w_1024,h_971,c_scale/v1605002007/ccd-cloudinary/image_1702c8580/image-1024x971.png)

## AWS Direct Hosting

The entire goal of running CodingCatDev on Wordpress was to simplify all of this for other Authors (Instructors) to start coming to the site and allowing them to build their own Courses to sell. So I left AWS pretty far down my list as I don't want to spend my time with maintaining all of this Infrastructure. I already have a day job that keeps me busy enough with AWS Amplify and serverless framework.  
  
However, after I read this Dev blog on [Best Practices for Running WordPress on AWS using CDK](https://dev.to/aws-builders/best-practices-for-running-wordpress-on-aws-using-cdk-aj9). I had to at least give it a try and see how much it would cost each month. [Mike Ng](https://dev.to/mike_ng) has a pretty awesome solution laid out using AWS CDK and provides a [Github repo](https://github.com/MikletNg/aws-serverless-wordpress).

![architecture-diagram-v2.png](https://github.com/MikletNg/aws-serverless-wordpress/blob/master/doc/architecture-diagram-v2.png?raw=true)

Architecture Diagram for Wordpress from CDK

Although I think this is an amazing solution and I think if I spent enough time on it, this would be a great turnkey solution for any client of mine. I hit a roadblock early on with CloudFormation and decided this is why I want managed hosting digging through the 187 resource this creates and making sure I have Route 53 and all the security setup correctly is still a waste of our time, again we need content and Authors!

![](https://res.cloudinary.com/ajonp/images/w_1024,h_504,c_scale/v1605002760/ccd-cloudinary/image_170447e74/image-1024x504.png)

AWS CloudFormation fail.

## Summary

Here is what I now know, if you have a solution that is working for a decent price, stick with it and it will pay off in the end! This in no way shape or form makes any of the other solutions bad, just not the right one for CodingCatDev.

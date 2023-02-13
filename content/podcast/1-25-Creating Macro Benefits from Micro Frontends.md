---
episode: 25
guest: 
    - Alex-Gogan
recording_date: March 29, 2021 5:30 PM
season: 1
status: released
podcast: CodingCat.dev
chapters_done: true
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/main-codingcatdev-photo/pvjydzcbs39pwocebmsd.png
devto: https://dev.to/codingcatdev/1-25-creating-macro-benefits-from-micro-frontends-2926
excerpt: We sit down to chat with Alex Gogan about how Sherpa is leveraging Microfrontends.
hashnode: https://hashnode.codingcat.dev/podcast-1-25-micro-frontends
slug: 1-25-micro-frontends
spotify: https://open.spotify.com/episode/5gkLrF5jX6ny5R1O8GSIBx?si=CXxsNmYjRkOzL1he-RZodQ
start: June 9, 2021
title: Creating Macro Benefits from Micro Frontends
youtube: https://www.youtube.com/watch?v=rgHttPaek8A
---
### Questions

1. **What is a Micro Frontend?**
    - architecture & design pattern
    "An architectural **style** where independently deliverable frontend applications are composed into a greater whole" - Martin Fowler
    Missing presentation layer of micro services
    - independent 
    - small in scope
    - complete
    - designed to work along each other
    - kinda like power rangers
    - mindset
        - often in the shadow of technical topics focused on intricate details of implementation
        - squads/teams/pods can focus on a value add for their customers/users e.g. team Search can focus entirely on "Finding the right product as fast as possible"
        - enables cross functional collaboration (diverse and inclusive teams can excel)
        - reduces friction between backend/frontend/design/product/ux/analytics/qa
    

2. **Can we talk about Basecamp on how you are using that for project organization?**

- took a lot of inspiration on [ShapeUp](https://basecamp.com/shapeup) for our internal process which we name sherpUp
- we run a series of projects for 6 weeks, each project can take 2-6 weeks each with at least 2 team members
- each team is, depending on the topic cross-functional and at least a designer + developer
- tackle often e2e, if a new feature requires a change in our data model/api/frontend the team will take care of everything
- teams are independent and enabled

3. **Do micro frontends speed up development time?**

- Yes
- advocate for incremental development through frequent deployments (~ 10 deployments per week) and close collaboration with partners
- feature flagging
- remote configuration
- keep our tech stack and tooling consistent across all frontends

4. **Can you still utilize a design system?**

- Yes, it becomes easier if everything is in a mono repo
- currently in the process of migrating the various frontends we have into a monorepo using the nx workspace
- Adapting Atomic Design (think in atoms, molecules and organisms)
- Organisms often remain as part of individual apps but adhere to the design system
- shared CSS classes + variables + mixins help quite a lot

5. **How does a typical architecture look for you?**

- we provide a Javascript SDK that acts as an application shell and turns any website into a host
- SDK or shell manages and maintains registered embedded elements (what we call micro frontends) that will be appended to the host DOM via iFrames
- inter-application communication is created through a message bus via post messages
- hosts are typically not in our control and our embedded elements need to be very flexible and adaptable to various environments e.g. devices/platforms and resolutions but also how much you can interact with each

6. **How does security play into Micro Frontends?**

- we embrace embeddability through iFrames which provide a strict isolation especially in sandbox mode
- important to limit functionality and content security policies
- when using post messages to communicate between iFrames, checking for origin/destination and validating payloads is necessary
- security teams might bring up concerns around click-jacking and end users not being able to distinguish or understand which part of the experience is part the host and which is ours ⇒ we visually indicate through "powered by sherpa°" and logo placements to provide clarity, nothing technical but very relevant

7. **Showtime**

- I'd be able to show our whitelabel solution that consists of 3 independent applications with two embedded elements (micro frontends)
- do a live code example using our SDK which might be interesting to see how simple it can be

Micro frontend resources
[https://github.com/billyjov/microfrontend-resources](https://github.com/billyjov/microfrontend-resources)

- Notes from initial call
    
    Angular Micro Frontend Architecture Questions
    
    Questions
    
    **What is Micro Frontend Architecture?
    Can you breakdown the difference between a normal SPA vs. using Angular Elements?**
    What is the difference between using elements, or complete applications as parts of a larger application, in terms of micro frontend?
    **Can we talk about Basecamp on how you are using that for project organization?
    Do micro frontends speed up development time?
    Especially across large teams?
    What are some of the key benefits?
    User-centered design?
    Incremental development?
    Maintainable Architecture?
    Can you still utilize a design system?
    Do you have to only use a singular framework?
    Have you ever mixed something like Stencil with Angular Elements?
    Module Federation**
    ????
    **Can we talk about iFrame solution / styling while creating widgets?
    Single App with multiple routes?
    How do you share state?**
    How
    **Multiple Apps?**
    Example of using the app
    [https://apply.joinsherpa.com/explore/USA](https://apply.joinsherpa.com/explore/USA)
    
    Additional Useful Links
    [https://www.angulararchitects.io/en/](https://www.angulararchitects.io/en/)[https://micro-frontends.org/](https://micro-frontends.org/)[https://itnext.io/handling-data-with-web-components-9e7e4a452e6e](https://itnext.io/handling-data-with-web-components-9e7e4a452e6e)[https://micro-frontends.zeef.com/elisabeth.engel?ref=elisabeth.engel&share=ee53d51a914b4951ae5c94ece97642fc](https://micro-frontends.zeef.com/elisabeth.engel?ref=elisabeth.engel&share=ee53d51a914b4951ae5c94ece97642fc)[https://github.com/rajasegar/awesome-micro-frontends](https://github.com/rajasegar/awesome-micro-frontends)[https://basecamp.com/shapeup](https://basecamp.com/shapeup)
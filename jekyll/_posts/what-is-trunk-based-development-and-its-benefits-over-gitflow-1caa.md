---
title: What is trunk-based development and its benefits over GitFlow?
description: What is trunk-based development and its benefits over GitFlow?
image: https://1drv.ms/i/c/c14ce25ddf8a1dde/UQTeHYrfXeJMIIDB4QoAAAAAAO4wqDZbrtXdqsM?width=660
date: 2023-03-30
---

# What is trunk-based development and its benefits over GitFlow?

If you have worked with [Git](https://dev.to/junedang/getting-started-with-version-control-part-1-what-is-version-control-g28) and encountered a situation like this: A big, long-lived featured branch was created last week ago about to merge and you have to review all the changed code for the whole week. This is the moment you realize that one developer cannot review those codes without missing small bugs, grammar issues, and missed test cases.

Things can get even worse when your team has implemented continuous integration and delivery (CI/CD), where changes are automatically deployed to production right after the feature branch merges with the deployment branch. With a large number of changes merged directly into the main branch, your product may experience significant changes in functionality, behavior, and user interface, making it easier for big issues to occur.

Then the big issue happened and your team wished to know what the f*ck just going on. Reverting the code may not be a good solution, as that means losing the effort put into the week’s work.

“There must be a better solution for this” – you asked yourself. Luckily, me and you, we are not alone since many big tech companies faced the same issue. A new approach implemented by Facebook, Google and other big tech enterprises is adopting Trunk-based development process. In today’s article let’s find out what is it and how it will help you better manage codebase of big projects.

## GitFlow (or Feature Branched)

Let’s first talk about the approach we discuss earlier, the GitFlow development process.

This development process was introduced in 2010 by [Vincent Driessen](https://nvie.com/about/). The idea behind this is to have a developer or group of developers create a separate branch from the Trunk branch (usually _main _branch) and work isolation on that feature branch until they see everything is completed and that feature branch is ready to merge to the trunk branch.

Usually, this approach means that all small changes on the feature such as development, tests, and bug fix are all done in that separate branch which will create a long-lived branch that could take a week or more to be ready to merge.

![Feature branch development](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9dl7punwxp7hm6q0cru3.png)


## Challenges of GitFlow development

From the image above, you can easily recognize the problems of GitFlow development: Because the process of developing a completed feature took too long that it is hard for developers to take quick feedback on changes, and also because the changes were too much that it is usually hard to review the code and I even not mention on the big monster here called _merge conflict_.

## Trunk-based development – A better approach

There is a better approach that solves above problems of GitGFlow although applying this will take some time and the learning curve that I will mention in a later section.

A trunk-based development (TBD) is a branching solution in that changes are directly moving onto the Trunk branch every day and the shared Trunk branch is always in the release status. Typically, developers that integrate TBD should regularly merge their changes to the trunk branch after they do small changes no matter if it is related to a new feature or bug fix. And in contrast with the long-lived feature branch development above, TBD branches should only last for hours to a day.

The image below will be best described for a typical trunk-based development workflow:

![Trunk-based development](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0tc96zljqxzy3fh2821y.png)

Here are some benefits of trunk-based development over GitFlow:

- **Improve code review section**: Because changes are now smaller and easier to read and review, your code will likely be reviewed quicker and also can avoid bugs that are hard to detect due to lengthy merge request of GitFlow.

- **Continual feedback loop**: Since changes are frequently merged and moved to the deployment state, your development team will benefit from receiving feedback on changes earlier.

- **Designed for CI/CD**: TBD is designed dedicatedly for continuous integration and continuous development policy where changes must be reviewed and deliver every day.

- **Feature flags**: As your changes will be delivered continuously, there is likely that sometimes you don’t want your changes to have in the deployed state. You can achieve this by implementing feature flag where you store configurations of your feature as flag. Thus, this will reduce the risk of having an unfished feature delivered to production and so gives more control over your feature changes and the codebase.

## How to implement trunk-based development

TBD is not a silver bullet point where your team can easily implement it within a few days. To be able to work well with this working process your team need to follow these practices:

1. Have no more than three active branches in the application’s repository.
2. Changes in branches should be merged regularly and branches should not live for longer than one day.
3. Your application should implement CI/CD that changes should automatically build and deploy.
4. Having feature flag configurations to reduce the risk of having unfinished features released.
5. Having a code review section before any change is merged to the trunk branch.

## Conclusion

With the rapid growth of CI/CD working process, more and more developer teams are looking for a solution that can help them speed up the development process. By reducing the headache of dealing with long-lived feature branches and forcing the changes to deliver regularly, TBD can solve the problem of going fast on new feature changes while keeping the classic branching working strategy that developers work separately and still help developers control their changes between codebase and the delivery features.

---
The original article was published on MARCH 30, 2023 at [junedang.com](https://junedang.com/what-is-trunk-based-development-and-its-benefits-over-gitflow/)

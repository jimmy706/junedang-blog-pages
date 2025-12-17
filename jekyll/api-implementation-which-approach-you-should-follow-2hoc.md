---
title: API implementation which approach you should follow
description: How to choose the right API implementation approach for your organization
date: 2021-11-11
tags: [api, design-first, code-first, architecture]
---

Imagine your team has a new business requirement and you are aside to implement that business logic into set of APIs for both application and website. What process or approach of API implementation will you do?

In today's article let's go through API implementation approaches and analysis which way that best for you and your organization.

## The importance of API in software development

With the rise of the adaption of API implementation in the digital world. More and more developers nowadays are working with API. Based on Postman [state of API](https://www.postman.com/state-of-api/), organizations are spending _more than half_ of their effort and resource on developing APIs.

With the rapid growth and widely used, it's clear that developers and organizations are more and more emphasizing the importance of API as the core of their system architecture.

## Two ways of implementing API

When talking about the strategy of implementing an API system, there are two ways: Code First and Design First.

### Code First

A traditional approach, technical oriented and straightforward. The business requirement comes as input and then the developer will try to implement the API logic as fast as possible. Lastly, the API documents are generated from the code as the complete state of API implementation.

### Design First

Design First means that every business logic will start with an API design process. APIs are designed and documented in a way that both business clients and developers can understand. The document will then be reviewed by both stakeholders and developers. Approval is required for the API document before any code or implementation process.

This process will make sure that all the work is under control, and that participants can have a clear understanding of the system. This way also it is ensured that any change or feedback will quickly reflect in the design.

## Pick approach that fit you

### Pros and Cons of Code First approach

Doing Code first approach could give you some advantages in-a-hurry situations or if you just want to do something that is simply technical-orientate:

- **Developer friendly:** Code Fist strategy follow the traditional development that is more familiar to developers. It also means that developers just care about the code base and don't have to learn any API design tool or language.
- **Fast-completed API delivery:** In case your requirement is not too big and required you to deliver by tomorrow, Code First approach may fit you in this situation.
- **Simple project:** It does not make sense when you have to design everything when you just have a small project for learning or feature testing.

But Code First by the time is seen as out-of-date and inefficient when it has many problems:

- **Time-consuming:** when the requirements are big and difficult, the time you spend to implement the code cost far more when compared to Design First. Not to say that with the rapid change of requirements in today's software development, it is likely that you have to rewrite your code which leads to double effort.
- **Bottlenecks:** Code First process required you to implement a completed code before any delivery and so any dependence on your API implementation cannot work in parallel.
- **Lack of documentation:** The API documentation in Code First approach is generated in the final state when the code was delivered. And so may lead to both stakeholders and developers may be missed or forgetting some important aspects of business.

### Pros and Cons of Design First approach

Compared to Code First, Deisgn First strategy is preferable in nowadays software development process due to its advantages:

- **Work in Parallel:** Unlike Code First, Design First comes with the priority of documentation and interfaces so that dependencies can work on their own business without waiting for the whole API's code to complete.
- **Cost saving:** Design First approach helps developers and stakeholders save tons of time and money because the time to brainstorm to design an efficient blueprint is more efficient compared to implementing the whole code base in the beginning. Also because the documents are generated in the first stage of development, they can be reused in many components during the development process.
- **Quick feedback:** Because developers and stakeholders both join in the design process so that any change and feedback will be sent right away. This way the cycle of design, feedback, and change is small which also leads to cost reduction.

Although seen as a more preferable, Design First also has some small cons:

- **Complex in the simple project:** You don't have to apply Design First process on everything since sometimes you just want to do a simple, small project.
- **Require education:** Design API is not easy, it is required your organization and you have a strong understanding of REST API design. Not saying that you also have to learn tools and languages that support API documenting like OpenAPI.

## Summary

In the end, Making clean and well-designed is crucial in API development aspect. So more and more organizations are applying Design First approach in their API development process due to its flexibility, reusable and cost-effective.

Although seen as an ineffective and outdated way of implementing API, Code First is still useful in some specific situation like in a small project.

## Reference

- [https://blog.stoplight.io/api-first-api-design-first-or-code-first-which-should-you-choose#:~:text=API%20design%2Dfirst%20means%20you,leverages%20the%20same%20API%20design](https://blog.stoplight.io/api-first-api-design-first-or-code-first-which-should-you-choose#:~:text=API%20design%2Dfirst%20means%20you,leverages%20the%20same%20API%20design)
- [https://www.gravitee.io/blog/why-design-first-when-building-apis](https://www.gravitee.io/blog/why-design-first-when-building-apis)
- [https://www.infoq.com/articles/design-first-api-development/](https://www.infoq.com/articles/design-first-api-development/)

---
If you like this article and want to learn more about technical stuff about API or how to become a more productive developer, check out my other articles at https://junedang.com/
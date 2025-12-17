---
title: Understand the fundamentals of TDD, DDD, and BDD: A comprehensive guide to these key software development concepts
description: How to survive and become a professional software engineer
date: 2021-11-15
tags: [tdd, bdd, ddd, software-engineering]
---

With the demand for quick response to business change in the software development world today. Many application development concepts have been introduced to help developers deliver their work in a fast, efficient way.

Agile development has been introduced to match modern software development. Its main focus is on delivering value to the customer through close collaboration and continuous improvement. During the process, teams that used Agile normally apply and combine concepts of TDD (Test-Driven Development), BDD (Behavior-Driven Development), and DDD (Domain-Driven Design).

In today's article, let's have an overview of these 3 concepts and what differences between them.

## TDD: Tests first – implement after

As the name said, in TDD (Test-driven development), the QA engineers will write test cases first before any code gets implemented by developers. By applying the test-first approach, TDD ensures that any code written will meet the requirement and be verified before any deployment to production.

TDD's goal is to bring the most quality, bug-free code into production. Here are some benefits when you apply TDD in your project:

- Quickly identify bugs and errors.
- Faster feedback when writing code.
- Encourage developers to write more clean, reusable code.
- Less time to test your code again.
- More confidence when changing your code.

Although bring many benefits, applying TDD is hard due to some drawback:

- Time spent during the beginning of the project may take longer when compared to other approaches.
- The learning curve of testing tools and processes for developers.
- Difficult to cover all the tests for complex logic.
- Take time to maintain tests.

## DDD: Understand the system then apply it to code

When dealing with a system that is large and complex, the most common approach is to break everything down into smaller fragments that are easier to manage and understand. In DDD (Domain-Driven Design), these fragments are called domains.

In DDD, the work is focused on implementing the connection between domains by creating entities, value objects, aggregates, and bounded contexts. To do that, the following steps can be done:

1. Understand the concept of business domain: identify the concept and create a shared understanding between domain-expert and developers.
2. Create bounded contexts: bounded contexts are smaller, well-defined fragments of business domain. This is aimed at better understanding and reducing complexity.
3. Modeling the domains: entities, value objects, and aggregates are then created from business domain which describes the behavior of domain in the system.
4. Implementing the models and testing.

DDD approach ensures that the business logic is aligned with software logic and that the application can support the need of the business side. This is required deep collaboration between developers and domain-expert.

## BDD: Test first on a more user-perspective

While TDD approach was more focused on a technical perspective that emphasizes primarily unit tests and automation tests to deliver quality code, BDD (Behavior Driven Development) takes the testing-first idea in TDD and combines it with ideas from DDD to bring a more human-oriented software development process.

In BDD, the work is focused on the collaboration between developers, testers, and business stakeholders to build high-quality, scalable software that meets end-user needs and requirements. Normally, BDD is done by defining tests in an English-like language so that everyone from the technical team to the business team can understand the ideas.

Usually, test cases in BDD are written in Given-When-Then format for understandable purposes:

- Given: the input or initial state of the component in a system.
- When: an action or event takes place in the test.
- Then: the expected output result.

Here are some benefits of applying BDD to the development process:

- Better communication between involvers through the use of natural language.
- More user-centered which helps software meet the requirement better.
- Faster feedback with automation test.
- Cost-effective.

## Hyper approach

A common approach nowadays when developing complex software projects is to combine these concepts depending on the project state to achieve the final goal:

1. Start the project by applying DDD to have a better understanding of the system and requirements. Ensuring the development team has a shared understanding with the domain expert to handle the complex logic of the system.
2. Relocate to BDD to after the business domain is well-defined and models are created to define the behavior of the system. Well-understood of stakeholders and developers is focused on this state.
3. Lastly, applying TDD to ensure the code is well-write and delivers quality code to the product.

Thank you for reading this article. If you found this article useful, please consider liking and sharing it with others who may also benefit from this information. Your support helps me to continue creating valuable content for you. Thank you!

Read more articles about tech, productivity, and software development from me at: [https://junedang.com/](https://junedang.com/)

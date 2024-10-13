As a programmer, we usually work with documentation, specifications and we maintain, organize these documents with [management tools](https://junedang.com/every-developer-should-learn-how-to-use-these-applications/) such as Jira or confluent pages. Normally, we tend to base on these documents to implement into our codebase then we use them again to provide information for test cases.

Problem is that business changes day by day and so do our codebase and documents. And during writing documents and code, we are likely to have duplication in our project. And so, whenever changes happen, we have to deal with the nightmare of finding every piece of information that we have written – even duplicating one and changing them.

## DRY – Don’t Repeat Yourself

One of the ways that guru programmers have come with is applying DRY principle so that our development process got easier to maintain and understand.

> Every piece of knowledge must have a single, unambiguous, authoritative representation within a system. - the pragmatic programmer

The idea behind this principle is simple, if you have more than one piece of things which expresses your document or codebase logic. Then whenever you change one, you have to find the other which leads to a question: which piece of duplicate information you have forgotten to change?

In DRY principle, it is encouraging developers should keep their documents and codes as reusable as possible so that the whole project or application can easily maintain and develop without making double the effort on changing business logic.

## Mistakes developers done that lead to duplication

In the book, [The Pragmatic Programmer](https://amzn.to/3TuHosx), David Thomas and Andrew Hunt have listed out the most common categories that developers intentionally or unintentionally fall into that lead to duplication:


![it hapen again](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9fhjb714y15czyba2otw.png)

### Impose duplication
Sometimes, it is unavoidable that duplication happens due to the requirements of the project example like: duplicate dependencies between projects, boilerplate code. In this case, developers normally don’t have the chance to apply DRY but keep in mind that these duplications should be small enough that doesn’t have a big impact on the system. Otherwise, refactoring is a must.

### Inadvertent duplication
This fallback refers to the unintentionally repeat code within the program where developer doesn’t realize the already exists. Sometimes, missing information about common functionality in the program can take a mature programmer doing the duplicate. Also, immature developers usually fall into this case when mistakenly duplicate their code due to lack of experience in designing a reusable codebase.

In some projects, lint tools and code analysis are provided so that flag duplication and help developers write code with best practices and patterns.

### Impatient Duplication
We are all having a time when the deadline forces us to deliver code and deploy it to production. That time-pressure moment may lead to later issues like bugs and performances that we called “technical debt”.

Think about every time you copy and paste similar functionality instead of thinking about optimizing the way that reduces duplication. Maybe you can save some minutes, but later lose hours of debugging and refactoring code.

Remembered this duplication fallback is the easiest form to detect but to take action that aligns with DRY principle needs discipline and awareness.

### Interdevelop duplication
Perhaps one of the toughest issues of duplication to detect and handle due to different developers, and teams between projects. This pitfall of duplication required a strong, well-understanding of system design and management skills so that changes, evaluations, and communications between groups have a common understanding.

## Strategies applying DRY principle
There are no easy and straightforward techniques that bring our pieces in one place and follow DRY principle. But here are some common ways that keep your code deal with duplication, all of them are based on the idea: “Eliminate Effects Between Unrelated Things”

### Use code generator

A simple approach to remove duplicate boilerplate code is to have a code generator that also automates our process of structuring the project directories. Which reduces the time and effort of coding that can introduce duplication and mismatch.

### Use document generator

You write documents and then implement them in code, or contrast. Then something changed and you have to update everything all at once. All these pieces of information somehow are the same. Instead, use tools such as OpenAPI that auto-generate documents so that developers only have to take care of their work at the code level.

### Modular project teams

When we define teams into groups of responsible features of the project, we are preventing the confusion of dealing with overlaps between the work of every team.

Start by separating application infrastructure into components that are easy to manage and decoupled from each other like (databases, user interface components, request interface layers, securities, etc…). And then based on the strength and behavior of each group we assign to suit the part accordingly.

### Abstract layers and functionality

Parts, modules and components in the system should be designed in the term that each implementation of them should be able to develop independently and changes in one component should only affect itself. Or in short, dependencies between components should be minimized and decupled as possible.

By using abstraction and interfaces, we ensure changes between components in the entire system don’t collapse on each other. Then, flexibility and reusability happen due to the ability to work independently of one component.

![applycation layers](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ibfxvpgcy7k1nlpw7ifr.png)

## How can the DRY principle help build better programs?

Applying DRY is hard and needs discipline, system design skills, tooling, and consistency. But the trade-off is good enough that we will have a system that is easy to maintain, simple, and scalable. But one thing you should remember is that DRY principle’s goal is to reduce duplication which is related to scalability, clarity and readability also important aspects when implementing DRY. Try to have a balance between DRY and other [programming principles](https://junedang.com/the-5-most-popular-programming-paradigms-every-developer-should-know/) that fit best for your application.

---
Original article published on _MARCH 15, 2023_ at [junedang.com](https://junedang.com/)

Checkout other related articles of me 👇
{% embed https://dev.to/junedang/monorepo-the-solution-to-microfrontend-development-challenges-24jh %}
{% embed https://junedang.com/the-5-most-popular-programming-paradigms-every-developer-should-know/ %}
{% embed https://junedang.com/api-implementation-code-first-or-design-first/ %}

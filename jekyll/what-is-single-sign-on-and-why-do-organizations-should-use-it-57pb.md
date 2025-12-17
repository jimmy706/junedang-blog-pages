---
title: What is Single Sign On and Why do Organizations should use it?
description: What is Single Sign On and Why do Organizations should use it?
date: 2021-11-29
image: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*U4sOB24_8x6J8P1uKXzDZA.png
tags: [sso, authentication, identity, security]
---

![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*U4sOB24_8x6J8P1uKXzDZA.png)

Imagine one day you just bought a new laptop and have to run all the necessary setup before making it work as you expect. Now because all the setting on this laptop is new, you have to manually sign in to countless websites and applications you use daily. This process is tedious and can take hours to get all the things done, not to mention the headache of managing multiple long and forgettable passwords you use to log in to those sites.

Lucky for you, Single Sign On (SSO) was born to solve this problem and make your life more convenient. But what is SSO and Why does it help you solve the above problem? Let’s discuss this topic in today’s article.

## What is Single Sign On(SSO)?

**Single Sign On** is the centralized authentication service that allows users to use a single login credential to access all the applications within the system. This means, users only have to log in once and all the access to other applications is automatically signed without manually signing in again.

SSO works by performing a single authenticate domain for the initial login of users and then establishing trusted connections with the marked signed-in user by exchanging a signed certificate between SSO and applications. When a user goes to on domain that necessitates login to continue he then automatically is redirected to the authentication domain. If he has already signed in to one of the applications within the system then SSO will share that information with the requested application. And as a result, the user can access the service without the need to log in again.

## How organizations can benefit from the use of SSO

Usually, organizations tend to implement multiple internal services for their specific purposes. And sooner or later they all face one challenge:

> _Many services should share the same authentication information between them. Then because the login information is the same, the authentication process should be considered simple enough for users to easily work when navigating between domains within the system._

Implementing the authentication process using SSO is crucial in this scenario. By having a central domain for authentication, SSO not only solves the problem of sharing login data between applications but also improve overall productivity by reducing the time-consuming of login multiple time for users.

Furthermore, SSO is centralized means that organizations have a single point to manage and monitor their security data like user access, role control, etc… The centralized nature of SSO simplifies the process of monitoring and investigating security events.

## Best practices for implementing SSO

The implementation of SSO may vary based on the need of your system and your organization. There are many SSO providers that each fit a specific purpose, two of the most common SSO protocols out there is SAML (Security Assertion Markup Language) and [OpenID Connect](https://dev.to/junedang/continue-with-google-how-oauth-system-work-4k3l).

Here is the checklist for you to consider when implementing SSO:

1. **Objectives**:  Define clearly the purposes of your SSO and the goal you want to aim for when implementing it like: What problems do you want to solve using SSO? Which type of users your organization serves?
2. **Infrastructure**: Do you host your SSO service on-prem or through a cloud service provider?
3. **Security**: Which services do you enable using the SSO solution? Multi-Factor Authentication may be a good approach for an extra security layer.
4. **User management**: Consider having a broader Identity and Access Management (IAM) Strategy from the SSO base which helps manage overall access control, role-based access, user provisioning, and user life-cycle.
5. **Scalability**: Your SSO plan should consider the accommodation to grow within your system over time.
6. **Accessibility**: To allow communication between backend services, check if you need to have [API](https://dev.to/junedang/a-fundamental-guide-for-designing-good-rest-api-1pg2) for your SSO service.

## Challenges you will face when implementing SSO

Convenience for users like that but SSO still has its drawback such as:

1. **Security risk**: Once an attacker takes control of your account, he can grant access to all of your daily applications that your account has access to. A Multi-Factor Authentication solution should be implemented to reduce the risk of account stealing.
2. **Role-Based Access Control and Flexibility**: If you have multiple applications and each of them require a unique access policy. Then, SSO may not be the right way since it has limited control over access roles for individual applications.
3. **Single failure point**: SSO is a centralized authentication service means it is not designed for fault-tolerant purpose and so it can easily to vulnerable and become compromised which result in users losing access to all the applications within the system. Monitoring failure service should be considered to prevent any failure in the system.

## Conclusion
In conclusion, Single Sign On is a great technology for organizations to solve the challenge associated with the user experience of accessing multiple applications within an organization’s system. And although has some drawbacks like security risk and single failure points, implementing SSO with best practices such as Multi-Factor Authentication and Monitoring System can help you overcome those concerns.

---
To get the most out of this article, feel free to complete these challenges 👇:

1. Does your organization use SSO for the authentication process? If not, do you consider recommend to use it?
2. If yes, what is the SSO implementation you are currently using?


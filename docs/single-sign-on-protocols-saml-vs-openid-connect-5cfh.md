# Single Sign On protocols: SAML vs OpenID Connect

Single Sign On (SSO) is a centralized authentication solution that allows users only use a single login and credential to access multiple applications that trust the SSO protocols within the system. This solution is more and more get implemented by organizations since it improves user experience when working with a system that has multiple applications that share the login user data.

Two of the most common protocol that implemented SSO is SAML (Security Assertion Markup Language) and OpenID Connect (OIDC). At first look, they are both performing the same functionality but they are quite different. Each will fit the specific requirement of your organization and distinguishing between them is crucial if you want to pick one that aligns with your organization’s needs.

In this article, we will discover the difference between SAML and OpenID Connect by exploring their commons, their unique characteristics, and what requirements fit each of them. After this article, we expect you to have the needed information to decide between choosing SAML or OIDC for your SSO service.

## How SSO works?
Typically, SAML and OpenID Connect are both SSO protocols and so they share the same behavior of Single Sign On authentication flow. At its backbone, SSO works by forming a trusted relationship between applications – known as service providers and SSO authentication portals – known as identity providers. The SSO authentication flow can be illustrated by the diagram below:

![How SSO works?](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ngrlgetxk7egmyucn0cx.png)


## How Single Sign On (SSO) works?

1. The user enters domain 1.
2. Domain 1 redirects the user to the SSO server for an authentication request. The user enters the login credential and requests authentication. This step may require multi-factor authentication (like OTP code) for security purposes.
3. After successfully verifying the user, the SSO system generates a unique token to represent the user’s login session.
4. The user then being redirected to Domain 1 along with the authentication token. Domain 1 then uses the token to communicate with SSO to check if this token is valid. This is the step where we will implement using SSO protocols like SMAL or OIDC.
5. SSO server returns to the service provider whether the token is valid or not.
6. If the SSO system tells Domain 1 that the token is valid, then Domain 1 can trust the user and return protected resources to render into view.
7. If the user navigates to Domain 2 which is within the same system, the same behavior as above. Domain 2 redirects the user to SSO for authentication.
8. This time SSO noticed that the user already logged in and so return the token without having to enter the credential again. The user being redirected back to Domain 2
9. Domain 2 accepts the authenticated token and returns protected resources.

## How SAML works?
The Security Assertion Markup Language is the standard for transferring authentication data between two factors: the identity providers and the service provider. SAML is based on markup language and supports XML to transfer data.

SAML is using the legacy browser-based approach for authentication which is an HTTP POST request and redirects to the authentication site. After the authentication process is completed, A SAML assertion will be sent from the identity provider to tell the service provider that a user is logged in and signed.

SAML assertion contains all the necessary data for the service provider to confirm who is logged in, what is the authentication source, the assertion’s valid time,etc…

## How OIDC works?
OpenId Connect is the SSO authentication protocol that extends the [OAuth](https://dev.to/junedang/continue-with-google-how-oauth-system-work-4k3l) modern web authentication using [RESTfuls API](https://dev.to/junedang/a-fundamental-guide-for-designing-good-rest-api-1pg2) by exchanging JSON Web Tokens (JWTs) to share login information between applications. And like SAML Assertions, JWTs contain all the needed data information for the service provider to validate with the identity provider whether the requested user is valid or not.

OIDC is simple and straightforward to implement because it is based on familiar web components like API and JSON data so that developers can easily adapt. Furthermore, OIDC is extremely flexible and scalable in authentication flow that supports multiple authentication flows like: Authentication code flow, Implicit flow, and Hybrid flow. Because of that, OIDC can both support browser-based and mobile-based authentication.

## The Differences between SAML and OIDC
| Feature             | OIDC                                                                                      | SAML                                   |
|---------------------|-------------------------------------------------------------------------------------------|----------------------------------------|
| Technology          | Extends the OAuth authentication flow and exchange data using JSON format and RESTful API | Based on the XML messaging format      |
| Authentication flow | Supports vary of authentication flows: Authorization code, Implicit, Hybrid               | Only supports POST redirect request    |
| Complexity          | Easy to implement and understand                                                          | Can be more complex due to XML format  |
| Use cases           | E-commerce applications, social networks, mobile authentication                           | Enterprise SSO, federated identity     |
| Data exchange       | Using JSON Web Token                                                                      | Using SAML Assertion                   |

## Conclusion
In this article, we have learned about how the SSO system works and the difference between its two popular protocols: SAML and OIDC.

SAML is based on markup language and supports XML which is more complex than OIDC. In contrast, OIDC extends the modern authentication model OAuth and supports familiar RESTful API with JSON format to exchange data that is easy to understand and implement.

---
To get the most out of this article, feel free to complete these challenges 👇:

1. What is the SSO authentication protocol your organization currently uses?
2. What is your favorite login method?


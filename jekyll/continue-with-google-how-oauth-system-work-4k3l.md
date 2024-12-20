---
title: “Continue with Google” – How OAuth system work?
date: 2024-10-20T00:00:00+00:00
image: https://1drv.ms/i/s!At4dit9d4kzBlybjUKQLdO5GDkF1?embed=1&width=660
description: What is OAuth, How it works behind the scenes, and Why we need it for the Internet to work?
---

Imagine one day you are downloading a new application – a fitness tracking app I would say. After the app finishes the installation process, you open it and then the application is now asking you to create an account to continue using it.

If you are like me – a lazy guy who is always too tired to type all the information about username and password then you will skip this step and maybe even uninstall the app. Luckily, you see a second option to log in called “Login with Google”. Then no second of hesitation you quickly click on it and now the app is automatically connected to your Google account and you are creating a new fitness account in less than a second!

So do you ever wonder: “How do Google and other platforms help you reduce the boilerplate of creating accounts?”. In this article, we will talk about authentication using third parties involved, or OAuth for short. How it works behind the scene and some best practices when implementing and using the OAuth systems for both tech and non-tech persons.

## What is OAuth?

OAuth (or Open Authorization) is a protocol used for authorization that allows applications permissions to access resources of other applications on behalf of a user without having to share the password to those applications.

OAuth works by sharing a special token called an access token with client applications that want to access the resources. Typically, this token is a random string generated by the OAuth server with the purpose of authentication and also authorization delegation that only exists for a small amount of time and can only access part of the resources from the application. We will discuss in more detail how actual OAuth works in the upcoming section.

Client applications that want to access through the OAuth protocol have to pre-define how much access to the resources they want (or the scope of the access). The resources owner (application user) has the right to approve clients’ access requests and if he is denied then the authentication process will be discontinued.

## Explain OAuth for non-technical

WOW hold on! Too many technical terms huh? If you have not yet understood what the heck OAuth is and how it works, then read this example:

Imagine you are the car owner. One day, you go to a fancy restaurant and park your car in front of the establishment. The valet attendant is eager to park your car for you. As the owner, you have the key that can control every function of your car, from opening the engine to accessing the glove box.

However, you don’t want to give the valet full control over your car. You only want them to unlock the door and start the car. What do you do?

You can request a second key from the car provider, which has limited functionality compared to the main key. With this secondary key, you can ensure that the valet can only help you drive the car to the parking area without accessing your private items stored in the car.

![OAuth example by valet key](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/uddc3l6itru5rd9m31i3.png)

## How do OAuth Systems work?

Let’s take the real-world example of authentication using Google account when you are trying to create an account on the Notion application. Those steps will happen when you click on “Continue with Google” button:

1. Firstly, you will be redirected to the Authorization Server of Google in which you are prompted to authenticate yourself by providing your credential to verify that you are the resource owner who wants to register with Notion.
2. Once you entered your credential and Google Authorization Server validates you are the resource owner, Notion will request access to your resource with its specified scope. At this step, you can choose whether this access is allowed or not. If the Notion application requests got approved by you then the following steps will occur.
3. Google’s authorization server generates a credential code and sends it back to Notion through a URL callback – a redirect URL that has been specified by Notion. This code will be used as a temporary code that represents your authorization for Notion access.
4. After acquiring the code, Notion then sends the code back to Google’s authorization server in exchange for the access token.
5. Alongside an access token, a refresh token will be sent because the access token can only be valid for a short amount of time and if Notion wants to continue the login process when the access token is expired, it has to use the refresh token to acquire a new access token.
6. Notion server can now use the access token to make authorization called on behalf of you – a resource owner.
7. Notion has now completed the registration process and can access your information, such as your name and avatar, through Google’s APIs using the access token.

![How OAuth work](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qnbavtci4fls1q9i3vlo.png)

In those processes, you can see that you are not providing Notion with your password to access the whole resources of your Google account. Instead, OAuth uses the token-based approach that clients only request to access part of your resources and use short-live, auto-generated tokens to access your resources.

This brings many advantages when talking about security and permission.

## Why OAuth?

But why OAuth? You will ask. Besides the convenience of not having to type username and password multiple times, OAuth systems are designed to:

- **Prevent password revelation**: The traditional username and password storage can lead to security issues especially when the page you register is not fully implemented necessary security protocols. By only giving an access token for a short amount of time and scoped use you reduce the risk of your access information getting revealed.
- **Easier to control your access right**: When creating access tokens for clients to use, you can easily manage how much access those clients are allowed to use for your information thus improving the security of your account.
- **Monitor registered clients**: Most OAuth systems have their monitor dashboard that allows you to see all apps that are accessed to your account and their scope of data access. You then can choose whether to continue to allow access to those apps or remove access to unused apps.
- **Scalability**: OAuth Systems are designed to be scaled and standardized between applications that allow developers to easily implement them into their system and provide a consistent login experience for users.
- **User experience**: By allowing you to register and log in with your existing credential with popular platforms like Facebook, Google… OAuth helps you get out of the headache of creating and remembering every username and password of each application.

## Best Practices and Considerations when implement and Using OAuth in your application

Although OAuth is proven to perform better when compared with the traditional approach of sharing usernames and passwords with client applications in terms of user experience, flexibility, and security, it does require developers and users to have a basic understanding of security principles. Let’s discuss some considerations involved in implementing and using the OAuth approach.

### For developers who implement Authentication and Authorization using OAuth

- Use trusted and up-to-date OAuth SDKs: Instead of implementing OAuth flow from scratch, use the well-tested and widely adapted OAuth libraries that have proven to be trusted by communities.
- Keep your secret key secure: OAuth uses your client’s secret keys to validate that your application has registered with the authorization server. So ensure your registered keys are secured by NOT hardcode them or store in public access places.
- Always use HTTPS protocol to communicate with OAuth Server.
- Follow the least privilege principle: Only request the needed access permissions to the resources of the resource owner.
- Properly handle errors from OAuth flow: Test and implement appropriate error handlers to prevent issues like expired tokens or invalid requests. This help provides meaningful feedback thus boosting the user experience when using your application.
### For users who using OAuth for the login process

- Be cautious and always read the scope of permission access: Carefully review and consider the authorization requests from client applications before granting access to your resources. Make sure that you trust the client application and understand the permissions and access it is requesting.
- Keep your OAuth application credentials secure: Your OAuth application credentials are the only entry point to several accounts, so be sure to keep them secure. Use strong and unique credentials for your main OAuth application to ensure your password is not easily guessable, and regularly change this password after a few months.
- Enable multi-factor authentication (MFA): If possible, use MFA to add an additional layer of protection to your OAuth account in case your password is compromised.
- And a final point, for the sake of your own data privacy: Regularly monitor the list of applications that have access to your OAuth credentials for login purposes. Take prompt action, such as revoking access permissions, if you notice any suspicious activities or security breaches associated with those applications.

## Conclusion

Now that you have reached the end of this article, I hope you have gained a comprehensive understanding of how OAuth systems work, illustrated through the real-life example of a valet key, and the step-by-step guide on how OAuth servers communicate with client applications that request access to resources.

As a final recommendation, I encourage you to take a moment to review the list of applications that have accessed your OAuth credentials and ensure there are no security issues. If you notice any unintended activities, please consider taking the actions I mentioned earlier to safeguard your account.

Thank you for reading, and I hope you found this article informative. Have a great day!

## References

- https://www.techtarget.com/searchapparchitecture/definition/OAuth
- https://auth0.com/intro-to-iam/what-is-oauth-2\
- https://developer.okta.com/blog/2017/06/21/what-the-heck-is-oauth
- https://spanning.com/blog/oauth-2-what-is-it-how-does-it-work/
- https://www.pandasecurity.com/en/mediacenter/panda-security/what-is-oauth/
- https://hackernoon.com/oauth-20-for-dummies

---

Originally published at [_junedang.com_](https://junedang.com/continue-with-google-how-oauth-system-work/) on April 29, 2023.

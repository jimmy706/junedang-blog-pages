---
title: 5 Ways ChatGPT Can Skyrocket Developer Productivity
description: A well-written API should provide a clear, consistent, and intuitive interface for developers to interact with it...
image: https://1drv.ms/i/s!At4dit9d4kzBln0qLVNLGaYkIso3?embed=1&width=256
---

# A fundamental guide for Designing Good REST API

We live in a world where everything from applications to websites use exposes API to communicate with backend servers. Therefore, REST API plays an important role in the system and it is crucial to take care of and design it carefully so we won’t fall into problems such as security, performance issues, or make it difficult for our client to use.

A well-written API should provide a clear, consistent, and intuitive interface for developers to interact with it. Developers who design API should aim to:

1. Simplicity: API should easy to understand and can be used with minimal effort.
2. Consistency: Naming conventions, response format, and error handling should format correctly between APIs.
3. Flexibility: API can be used by any client regardless of what platform the client uses.
4. Scalability: REST API should able to evolve and work independently from its clients.

In today’s article, we’ll look into 5 best practices for [designing API](https://junedang.com/api-implementation-code-first-or-design-first/) for developers to achieve the above criteria.

## What is REST API?
Ok, before diving into the list of best practices. Let’s review the meaning of “REST API”. If you are already familiar with this term then you can skip this section.

A REST will stand for **REpresentational State Transfer**, it is a software architecture style of the web created in 2000 by [Roy Fielding](https://roy.gbiv.com/) that follows these constraints:

- Client-server communication
- Stateless protocol
- Caching data
- Uniform interface
- Layered system
- Code on demand

An API that follows REST design principle will be called RESTful API. Simply to say, REST API is an application interface that forms a communication between client and server where the main communication channel will be through HTTPS protocol.

That’s all for the definition, no more talking, and let’s go to the list of best practices to design a good API.

## 1. Naming Convention
_It’s all about naming, my friend_. Yes, one of the most crucial point every developer face during the work that defines a good name for their variables. And now, that pain point is coming to designing your API. Luckily, there are rules you can follow to know whether your API is named correctly.

### Avoiding Verbs, use Nouns instead

Whenever possible, your endpoint should always use nouns instead of verbs. This design’s purpose is to avoid confusion to the user when the API methods already verbs (we will talk about this in a later section)

### Group related resources to nested endpoint

When deciding on an endpoint, it is important to know that the endpoint contains correct and related information so that the user understands the API they are using points to the correct resource they want to interact with. One good practice you can easily follow here is that you design endpoints based on your database entity public resources you want your user to access.

For example, if you have an `Article `table on your database then you can design your endpoint like `yourdomain/articles`.

The following point I want to mention is if your object contains smaller objects – a `Comment `object for example. Then it is advisable to append the sub-object to your parent object so the group of related information can locate in the same structure so that the user easy to understands your API purpose.

Back to `Article ` object above example, if you want to have the substructure for Article object then your API endpoint now will look like this: `yourdomain/articles/:articleId/comments`.

![good API endpoint example](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tuj4wvru7pl3h4gh7lr3.png)

## 2. Using Correct HTTP Semantics
REST API is built dedicated to HTTP protocol and because of that, HTTP protocol provides us a list of handy request methods that we can use to describe our purpose for the API request. The most commonly used HTTP methods included: GET, POST, PUT, and DELETE, or we can call these methods [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) operations. And as you can see, ALL of them are verbs (that is why it is recommended to not use verbs on naming your endpoint).

The meaning of each request method:

1. **GET**: Request to retrieve a specific resource that matched your request endpoint. The response body of this request includes detailed information about that resource.
2. **POST**: Submit a form of data to create a resource for the requested endpoint. Sometimes this method can be used to trigger a specific action that doesn’t create anything.
3. **PUT**: This request method can be used either to update or replace the existing resource on your server.
4. **DELETE**: the name of this request method already mentions its usage. This one is used to remove a specific resource based on the endpoint of the request.

![HTTP methods example](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ikwrz486ugyr4xvm0fo7.png)

## 3. Clear Documentation
When you develop your REST API and expose them to your users, it is very important to provide them with good documentation so that your users can understand your API capability and know how to interact with your API. Good API documentation should follow these criteria:

1. Provide related endpoints that the users need.
2. Example for every possible parameter.
3. Should contain information about possible responses including the body and HTTP code.
4. Should have a description that describes the use of that API.
5. The document should easy to access in common formats like JSON, YAML, etc
6. If possible, your API should have the ability to interact so that users can easily playground with them.

When come to API design, the [tools](https://junedang.com/every-developer-should-learn-how-to-use-these-applications/) that I mostly recommend developers use are [Swagger](https://swagger.io/) for documenting your API and [POSTMAN](https://www.postman.com/) for testing.

![API documentation example](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/o163byliqwzt48yhpyct.png)


## 4. Handling Errors and Responses Based on HTTP Code
HTTP specification has come with HTTP response status codes system where it tells you your request has successfully completed or failed. From these response codes, your front-end system can easily detect and react to the correct response from the server. The response codes are grouped into five categories:

### Information codes (100 – 199)
Those response codes tell the client that their request is received and processed by the server. The most common codes in this group included:

- **100 Continue**: The server has received the request headers and the client should proceed to send the request body.
- **101 Switching Protocols**: The server is switching protocols, such as from HTTP to WebSocket, and the client should switch too.

### Successful codes (200 – 299)
When receiving this code it means that your HTTP request is successfully handled by the server and the response data is sent back to the client. The most common codes in this group included:

- **200 OK**: The request was successful, and the server has returned the requested data or resource.
- **201 Created**: The request was successful, and a new resource has been created on the server.
- **204 No Content**: The request was successful, but there is no data to return in the response body.

### Redirection codes (300 – 399)
These codes indicate that your request has been received and the server move your request to the right responding resource, then the client should communicate with the new redirect resource. The most common codes in this group included:

- **301 Moved Permanently**: The requested resource has been permanently moved to a new URL. The client should update its bookmarks or links to the new URL.

### Client error codes (400 – 499)
The meaning of these response codes tells clients that their requests have been invalid due to mistakes like Unauthorized, incorrect request data, forbidden requests, etc… Most common codes in this group included:

- **400 Bad Request**: The server could not understand the request sent by the client due to invalid syntax.
- **401 Unauthorized**: The client needs to provide valid authentication credentials to access.
- **403 Forbidden**: The client does not have sufficient permissions to access the requested resource.
- **404 Not Found**: The requested resource could not be found.

### Server error codes (500 – 599)
Unlike the above response codes where errors are expected from the backend, the 5xx response codes are returned when unexpected errors happen on the server side. The most common codes in this group included:

- **500 Internal Server Error**: The server encountered an unexpected condition that prevented it from fulfilling the request.
- **502 Bad Gateway**: The server acting as a gateway or proxy received an invalid response from the upstream server.

![HTTP status code](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/aizqgb43u6zgpx6hlh47.png)

### 5. Allowing Interaction on APIs
A final best practice I want to mention here is that API is the way clients interact with the server and so it should provide a way for clients to use the API in the way they want through parameters.

Most of the time, resources returned from the APIs are data queried from the database. And data from the database can be very large which exposes that amount of data in a single API request call can lead to performance problems, especially when users only need the subset of data. Therefore, consider adding the paginate functionality to your API to improve performance and avoid confusion among users when dealing with enormous amount of data.

Another way to improve performance and user experience when using our API is by allowing filtering data by passing queries into the API. You can handle the filtering based on the attributes of the data you send to users. For example, having a list of products with name field, then you can allow users to filter out the products with the name they want.

Also, consider your clients want the data they retrieve to be in order for the displaying purpose. To achieve that, we can provide a query param that accepts which field they want to sort and in which order they want. For example `yourdomain/products?sort=+name`. Where + means ascending and – means the opposite.

![API Interaction](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qo0dnxkv0vgz9xq94dj6.png)

## Conclusion
APIs are one of the most important factors of nowadays applications. Understanding how to design a good API can help your application improve its usability, productivity, and better in scale over time.

The most important key takeaway in API design is following nouns in naming your endpoints and using the correct HTTP methods for the correct API purpose.

Usability should be taken care keeps your API in up-to-date documentation and also handle responses and errors at the correct conversion.

Also, the performance should consider by able your API to have query params for sorting, filtering, and paginating.

---
Thank you for reading, if you like this content feel free to like and share to spread the knowledge.

The original article was published on APRIL 08, 2023 at [junedang.com](https://junedang.com/a-fundamental-guide-for-designing-good-rest-api/)

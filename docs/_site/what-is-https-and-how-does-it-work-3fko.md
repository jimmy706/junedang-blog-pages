# What is HTTPS and how does it work?

Have you ever wondered how websites communicate with a web browser and request data to the server to render into view?  I used to ask those questions too.

If you are like me, curious about how the Internet work then you come to the right place. In this article let’s discuss how HTTPS works and how essential its role is to the World Wide Web.

## What is HTTP?
The first step to having an understanding of HTTPS is to know its ancestor: HTTP. Hypertext Transfer Protocol (HTTP) is a common protocol for communicating between websites and browsers throughout the Internet. With the help of HTTP, all the information and connection of the entire World Wide Web are formed, and it is not a lie to say that HTTP is the major factor that backbone to the creation of the Internet we are using today.

## HTTP requests and responses
HTTP is a request-response protocol, in which HTTP requests are sent from the client and server to handle those requests and respond to the client’s HTTP responses. Typically, a [Transmission Control Protocol](https://en.wikipedia.org/wiki/Transmission_Control_Protocol) (or TCP) is used to form the connection between the HTTP client and server.

### HTTP request
HTTP requests are sent from the browser to ask specific information to the server it needs to render into view for the user’s device. Each HTTP request contains the following important information:

- HTTP version.
- The client hostname or URL.
- The HTTP method.
- HTTP request header: Includes information like which type of data the client wants the server to respond to, what kind of browser the current user used, etc.
- HTTP body: In case the client wants to submit data, otherwise this is optional.

### HTTP response
When the server finish handling the request of the client, it replies with an HTTP response which includes the following information:

- HTTP status code.
- HTTP response header.
- HTTP response body.

## How HTTP works?
A common HTTP communication between clients and servers will be taken by the following steps:

1. The user enters the domain name, such as junedang.com, into the browser.
2. The browser acts as the client and sends a “GET” request to the server that hosts the specified address.
3. The server receives the request and analyzes the desired response from the client. This could include various types of data such as media, JSON, HTML, CSS, etc.
4. The server sends back the response to the client.
5. The client (browser) receives the response from the server and proceeds to render or execute the content based on the requested information.
These steps demonstrate a common illustration for a GET HTTP request. In reality, HTTP supports many methods for clients to send requests. Each supports a specific type of purpose. Some of the most common HTTP methods include:

- `GET`:  Retrieves data or a web page from a server.
- `POST`: Submit data for processing. Usually used in form submission.
- `PUT`: Sends data to the server to create or update a resource.
- `PATCH`: Sends partial data to update an existing resource.
- `DELETE`: Requests the server to delete a specified resource.

## The disadvantage of HTTP – Why we need to secure our HTTP requests

Although very important to the Internet, the original HTTP still suffers from security issues due to a lack of these abilities: data privacy, integrity, and identification.

![disadvantages of HTTP](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/usan2yugjj9xtspdrh7n.png)

### Data privacy
HTTP communication is not encrypted and because of that, data transfer through the Internet by HTTP is not secured and can be easily eavesdropped by bad factors. This is extremely dangerous to the users, especially with sensitive information like login credentials, personal data, or bank details.

### Integrity
The data sent between clients and servers using HTTP are unencrypted and so can be tampered with or modified without detection. Lack of integrity means data can be changed in the middle of the transmission which can lead to misunderstanding of information. With HTTP, there are no built-in safeguards to verify if the data remains intact and unaltered during transit.

### Identification
HTTP is purely all about data transfers and communications but cannot verify the identity between communicators. This can open to potential impersonation attacks like man-in-the-middle.

## What is HTTPS?

To get rid of HTTP downsides, an HTTPS protocol is introduced which stands for Hypertext Transfer Protocol Secure. It extends all characteristics of the old boy HTTP with added effective security layer using [Transport Layer Security (TLS)](https://en.wikipedia.org/wiki/Transport_Layer_Security) for data encryption.

Before HTTPS, the transferred data somehow looks like this:

```
GET /HTTP/1.1
Host: www.junedang.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Accept: text/html,application/xhtml+xml
```
The informations are all shown through the eyes of the attacker. Now with the help of encryption using HTTPS, the data is encrypted and looks like the below:

```bash
bG9sZWNoYXV0aDpteXNlY3JldHBhc3N3b3JkCg==
```

With this approach, data is secured from being eavesdropped or captured during transferring – if the attackers have hijacked the data, all they receive are just encrypted binaries. Furthermore, HTTPS attached a digital signature of the domain to the transferred message which can ensure the identity of the receiver you would expect.

## How HTTPS works?

As mentioned above, HTTPS works exactly the same as HTTP with an additional security layer called SSL. SSL is based on a technology called public key cryptography: the server stores the private key while the public one is shared with the clients through SSL’s certificate. The flow of how HTTPS works can be illustrated by a diagram below:

![How HTTPS works?](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/x2wh0pxztcx62cj4y3oe.png)
1. The client (web browsers or mobile devices) establishes an HTTPS connection with the server using https:// instead of http://.
2. The connection is established, and a TCP connection is formed between the client and the server.
3. The client and the server exchange the SSL information through a three-way handshake. If the SSL version is supported by both client and server the server sends an SSL certificate to the client which contains the following information: the public key, hostname, expiry dates, etc.
4. The client validates if the certificate is issued by a trusted Certificate Authority (CA) and has not expired or been revoked.
5. After successfully validating the certificate, the client generates an encrypted session key using the public key.
6. The server receives the encrypted session key and then decrypts it using the private key.
7. Now both the client and server share the same encrypted session key. A secure connection can be established then.
8. Encrypted messages are transferred in a bi-direction security channel.
Through this process, HTTPS ensures the three security pillars that were missing from the HTTP protocol: data privacy, integrity, and identification.

## Conclusion
HTTP is one of the most important technologies to form the Internet through establishing the connection between clients and servers for data transfer. But HTTP is lack security factors that can cause serious problems to end-user related to data privacy, integrity, and identification.

To overcome those problems, an HTTPS protocol is created to ensure the communications between clients and servers are safe and secure.

---
To get the most out of this article, feel free to complete these challenges 👇:

**🐣Easy mode:**

1. Check your current organization’s website to see if they are using an SSL certificate or not.
2. What is the information that is stored in an SSL certificate?

**🔥Hard mode:**

1. Can you list down a step-by-step on how to create a trusted SSL certificate?


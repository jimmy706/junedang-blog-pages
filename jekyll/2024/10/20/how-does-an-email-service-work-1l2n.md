---
title: How does an email service work?
description: How does an email service work?
image: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Z5WhK0XAI8buYjN0s4tsdg.jpeg
---

![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Z5WhK0XAI8buYjN0s4tsdg.jpeg)

# How does an email service work?

Email has become the cornerstone of modern communication tools and seamlessly integrating as part of our daily work. A [statistic by Statista](https://www.statista.com/statistics/456500/daily-number-of-e-mails-worldwide/) estimates that over 333 billion emails are sent and received every day. But have you ever been curious about the process of emails being stored and sent across the Internet? If yes, then this article is for you. 

In the upcoming sections of this page, we will guide you through the most important protocols that help email services to function and finally answer the question: “How every email service works by relying on the use of SMTP to send email and IMAP (or POP3) to store and receive email”. 

## From sending or “pushing” emails with SMTP 
Simple Mail Transfer Protocol (or SMTP) is a standard TCP/IP protocol for sending and receiving email. This protocol plays a crucial role in email infrastructure and is commonly used by email clients like Outlook, Gmail, or Thunderbird for delivering emails to intended receivers. 

### SMTP server 
With every email client, there needs to have an SMTP server to send, receive, or relay emails. You can imagine an SMTP server as a post office that takes your mail and handles delivery to any address you would like to send. 

SMTP server is an Outgoing Mail Server application that typically operates on port 25 or 587. Each port behaves differently in that it identifies the process of messages transmitted through the Internet. Some of the main functions of an SMTP server include: 

- **Messages Transmission:** the key role of the SMTP server is to establish a connection to the recipient’s server and relay outgoing email messages from the sender. 
- **Address validation**: An SMTP server can perform domain name resolution to ensure messages can be successfully delivered.
- **Messages routing:** SMTP server determines the most efficient route for delivering the email to the recipient’s server by rapidly communicating with other servers during the way sending the email. 
- **Ensuring security and authority:** To prevent spam, an administrator can configure to only allow certain clients to use the server.
 
### SMTP commands 
During the messages transfer, an email client and the SMTP server can communicate through basic instructions called SMTP commands. These commands contain information that helps the SMTP server successfully deliver the messages such as sender and recipient addresses, message content, and status updates. Some common commands are: 

- **HELO or EHLO:** Initiate communication between the sender’s SMTP client and the recipient’s SMTP server. 
- **MAIL FROM:** Specify the sender’s email address. 
- **RCPT TO:** Indicate the recipient’s email address. 
- **DATA:** Trigger the transfer of data between the client and server. The message’s content is sent to the SMTP server, including the subject, body, and any attachments 
- **QUIT:** Used to terminate the session from client and server once the email transmission is completed. 
- **RSET:** Allows the sender to reset the current email transaction in case any errors happen. 

### SMTP limitations 
Although SMTP can both send and receive email, most email services nowadays use it only for transferring emails as SMTP has limitations on queuing received emails and providing storage capabilities: 

- **Minimalistic Protocol:** SMTP is designed to focus on efficient message transfer and thus lacks key features for persistent email storage and mailbox organization. 
- **One-way communication:** SMTP only supports sending emails from sender to receiver and does not facilitate email retrieval or fetching. 
- **No mailbox management:** SMTP does not support a mailbox directory and so it cannot let users manage their mailbox such as: organizing emails into folders, marking them as read or unread, or searching for specific messages. 
To overcome the limitations of SMTP and ensure better storing and receiving capabilities, email services typically combine the use of SMTP with dedicated storage protocols such as POP3 or IMAP for email storage and retrieval. 

## To receive with IMAP or POP3 
As mentioned earlier, IMAP and POP3 are both protocols that are used to receive or “pull” for recipients to read and store their incoming messages. More than that, you can set up security on these protocols to allow only receiving emails from verified sources. But above all that, these two protocols CANNOT be used for message transferring. 

### POP3 
Post Office Protocol or POP for short is an email-receiving protocol with the latest version POP3 that was released in 1988. POP3 is based on the real-life idea of the post office that the email server will hold any received messages until you read them. After you connect to the mail server, it will download all received messages and store them locally on your computer for offline access. All the downloaded messages are removed from the server then. 

### IMAP 
Internet Message Access Protocol (or IMAP) on the other hand, keeps the email on a server and then synchronized changes across multiple devices. Furthermore, you can access real-time folders, messages, and mailbox organization. But its behavior requires Internet access to be able to read or organize the messages. 

## How does an email service work? 
A common email message transmission from the sender’s client to the recipient’s client included a three-step process that you can illustrate by the diagram below: 

![How does an email service work? ](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/r6laie9uvqocvdjnh2r9.png)
#### 1. Sending an email using SMTP 

- The sender opens the mail client (such as Gmail, or Outlook) and creates a new email message 
- When the sender clicks the “Send” button, the email client connects to the outgoing SMTP server 
- The email client supplies the SMTP server with necessary information such as the recipient’s email address, sender’s address, subject, message body, and any attachments. 

#### 2. Transmit email messages from the SMTP server through the Internet 
- The SMTP server performs a DNS lookup to get the routing to the recipient’s email server’s IP address.

#### 3. The recipient’s server receives the incoming message 

- **With IMAP:** The client requests an email list from the IMAP server and reads it. The email then stays on the IMAP server and any changes are synchronized within the IMAP server. 
- **With POP3:** The client requests an email list from the IMAP server and reads it. The unread email then is downloaded into the client’s local device and then removed from the POP3 server. 

## Conclusion 
On the bottom line, an email service for the sender included the email client interface and the SMTP server for transferring messages, and for the recipient, there needs to be the receiving server to “pull” messages from the sender and store them such as IMAP and POP3. While IMAP offers real-time synchronization between devices, it cannot access emails when you are offline. POP3 in contrast, allows you to download all receiving messages, and change and read them on your local device without an Internet connection. 

## Questions 
Over to you, let’s check your knowledge of this article through some questions: 

1. What are the primary components of an email service? 
2. What are the differences between IMAP and POP3? 
3. Can you list down some common SMTP commands and their meaning? 


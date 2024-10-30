---
title: Behind the Scenes of the Internet - The Domain Name System Explained
description: What is DNS, How it works behind the scenes, and Why we need it for the Internet to work?
image: https://1drv.ms/i/s!At4dit9d4kzBlz9dQbVawvWNzHAp?embed=1&width=660
date: 2023-05-03
---

# Behind the Scenes of the Internet: The Domain Name System Explained

If you ever typed `google.com` and instantly your browser recognizes the domain and loads it into the view, you will be thanked for the **Domain Name System (DNS)** that helps you with all the work of recognizing the domain names and mapping them into the correct IP address over the internet. In this article, we’ll take a closer look at one of the most crucial technologies for the Internet today: What is DNS, How it works behind the scenes, and Why we need it for the Internet to work?

## Why do we need DNS?
Did you know that every device connected to the internet has a unique number used for communication with other devices? These numbers are called IP addresses, and when it comes to websites, they serve as references to the machines that host them.

IP addresses are represented as a series of numbers, like `167.172.53.222`, and can be used to access websites. However, remembering these numbers can be challenging, which is where the Domain Name System (DNS) comes in. Just like the phonebook on your phone that associates phone numbers with names, DNS maps domain names like google.com to their corresponding IP addresses.

In addition to making websites more accessible, DNS also enhances security by preventing malicious actors from redirecting web traffic or intercepting sensitive data.

## What is DNS?
The Domain Name System is like a phonebook of the Internet. It translates human-readable domain names into numerical IP addresses that computers and devices used to locate and connect to each other through network protocols.

DNS is a distributed system, meaning that it relies on many interconnected servers working together to provide the service. This is because serving millions of registered domain names is a massive undertaking, and storing all of these names in a single resource would be impractical and lead to performance issues. Instead, DNS servers around the world maintain databases of domain name mappings, and they work together to resolve domain names to their corresponding IP addresses. This distributed approach also provides redundancy and resilience to the system, ensuring that it remains operational even if some servers are unavailable or under attack.

![DNS is distributed system - June Dang Blog](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5zvzjg5cino57md3j7z0.png)
## How does DNS work?

DNS transforms from human-readable domain names into computer-friendly IP addresses by a process called DNS lookups. To understand how this process works, let’s look at the following diagram for an overview of this process:

![How DNS work - June Dang blog](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zj8xv5x4b29dvd95efip.png)

1. The user opens the computer and enters a web address into the browser. google.com for example
2. Your computer sends a query request to the DNS resolver to find the corresponding IP address. Typically, DNS resolvers are managed by the user’s Internet Service Provider (ISP).
3. The DNS resolver checks the cache to find the record that matched the requested domain name. If the resolver can’t find the answer, it then redirects the request to DNS root name servers.
4. The root name server is used to find information about top-level domain (TLD) servers (like .com or .net). In our example, the request is pointed to .com TLD.
5. The resolver now sends the request to the TLD .com server to find information about the authoritative server.
6. The TLD server responds with the address of the requested domain name and the IP address of the authoritative server.
7. The DNS resolver then continues to send the request to the authoritative server looking for the IP address of the website you just type in on the browser.
8. The authoritative server is the server that is responsible for the DNS resource and acts as a final point in the DNS lookup chain. It responds to the DNS resolver with the correct IP address needed to access the website resources.
9. The DNS resolver caches the responded IP addresses for future access and returned them to your computer.
10. Lastly, when your computer received the IP address, it can make the HTTP requests to the web server through TCP protocol.
11. The web server now will respond to your computer with resources for rendering into the screen.

Those steps may seem complicated and time-consuming but in fact, they just happen in a matter of a few milliseconds. In addition, those steps can also be improved with the help of the DNS caching technique which reduces significantly the load time of DNS lookups.

## Conclusion

In summary, DNS is the backbone of the Internet that works as a distributed system and is used for translating human-readable domain names into computer-friendly IP addresses. Which enables humans easier to interact with websites.

The process of mapping domain names to IP addresses is known as a DNS lookup, which typically involves sending a request to a DNS resolver, which then queries various levels of DNS servers until it finds the correct corresponding IP address. This process is critical to the functioning of the internet and helps to improve security by ensuring that users are directed to the correct websites and not to malicious ones.

---
_Originally published at [junedang.com](https://junedang.com/behind-the-scenes-of-the-internet-the-domain-name-system-explained/) on May 3, 2023._

---
title: How Modern Web Browsers Render Pages? - Part 1
description: This first part explain how your website is found over the Internet
date: 2025-02-09
image: https://storage.googleapis.com/junedang_blog_images/how-modern-web-browser-render-page-part1/cover-image.webp
---

When you typing something on the browser, have you ever wondering whether the site you are looking for locate? And how the browser able to search and response the page to your computer? Let's find out in this article.

## What is browser rendering?

A page resources content HTML, CSS and Javascript and web browser will take these resource and visualize into our screen. This involves several stages, including parsing, constructing internal representations, and painting pixels on the screen.

## DNS navigation

Before a browser can render a webpage, it must locate the server where the website is hosted. This involves translating the human-readable domain name into an IP address called **Domain Name System (DNS) resolution**.   

The process to transfer from hostname into a system-readable IP involve following steps:

![DNS Lookup Process](https://storage.googleapis.com/junedang_blog_images/how-modern-web-browser-render-page-part1/dns-navigation.svg)

1. User enters the domain name in the browser.
2. Computer requests DNS lookup from the DNS resolver (recursive resolver).
3. DNS resolver checks cached data for the IP address.
4. If cached, the resolver returns the IP address to the browser.
5. If not cached, the resolver queries the root DNS server.
6. Root DNS server responds with the address of the TLD nameserver (e.g., .com TLD nameserver for example.com).
7. Resolver queries the TLD nameserver.
8. TLD nameserver responds with the address of the domain’s authoritative nameserver (e.g., example.com’s authoritative server).
9. Resolver queries the authoritative nameserver.
10. Authoritative nameserver responds with the IP address of the host.
11. Resolver caches the IP and returns it to the browser.
12. Browser requests resources directly from the host using the IP.

## Caching mechanism

Image your site is located on different country that far far away from your location and so he DNS lookup could take sometime to finally complete the request for the resource. Because of that, caching is critical so that it browser can speed up the process of rendering page. This include storing previous DNS result temporarily on your machine. 

---

Today you are learned about the DNS look up, in the next article we will discuss how resources from web page are visualized into your screen. Stay tune!
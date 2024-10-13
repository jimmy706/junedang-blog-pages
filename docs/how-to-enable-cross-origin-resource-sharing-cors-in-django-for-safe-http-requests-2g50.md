## Situation
Imagine you are learning web development with Python and just started a Django project for your web project. Everything looks clean and perfect, you have the database running, the models are designed and REST APIs are ready to be requested.

Now you come to your front-end site and started to send the request to your back-end and suddenly your request is blocked. The error message displayed: “Access to fetch at ‘http://127.0.0.1:8000/users’ from origin ‘http://127.0.0.1:5000’ has been blocked by CORS policy”.

What just happen? You’re now checking your code again to make sure you don’t make any mistakes but even if your code looks perfectly fine, the error is still there.

Don’t worry, you are just missing, [Cross-Origin Resource Sharing(CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) configuration in your Django project. In this article, we will discover what is CORS and how to turn it on to allow your JavaScript code to send HTTP requests.

## What is CORS?

By default, a web page can only access the resource of the same domain, any request to other domain resources if not allowed by that resource will be blocked automatically by web browser. This feature makes the web more secure and prevents cross-site scripting (XSS) attacks.
CORS is a mechanism that allows web application requests to API from other domains which strongly supports by modern browsers and can be easily implemented in Django using `django-cors-headers` library.

## Enable CORS in Django

First, you need to install `django-cors-headers` using pip command:
```
pip install django-cors-headers
```
After the package is successfully installed, open your `setting.py` file in your Django project to config CORS. In the setting file, you need to add `corsheaders` in the list of `INSTALLED_APPS`
```
INSTALLED_APPS = [
    ...
    'corsheaders',
    ...
]
```

You will also need to add a middleware class to listen in on responses and make sure the middleware is added before any other middleware that inspects the response. If it is not before, it will not be able to add the CORS headers to these responses:
```
MIDDLEWARE = [
    ...
    'corsheaders.middleware.CorsMiddleware',
    ...
]
```

Finally, config the middleware `CORS_ALLOWED_ORIGINS` inside `setting.py` file to allow a list of domains that allow sending a request to your backend API. For example, if your front-end server is on _http://localhost:5000_ and you want to send a request from that, just add:
```
 CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:5000",
]
```
Come back to your front-end again and check the result, your request is now safe to call and get the response perfectly.

`django-cors-headers` has other configurations for you to freely set up like allowing CORS based on regex or which kind of HTTP method is allowed in CORS…. See other configurations of `django-cors-headers` [here](https://pypi.org/project/django-cors-headers/).
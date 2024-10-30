In our [last article](https://dev.to/junedang/an-evolution-story-of-software-deployment-from-dedicated-server-to-containerization-4ol6), we have discovered what is Docker, how your system benefits from it, and how it works. In the following article, we will discuss the implementation of Docker with hands-on example code from creating Docker Image using Dockerfile to basic commands to run a simple to-do-list application on Docker.

To get the most out of the context of this article, feel free to read my previous article to get a brief understanding of what is Docker and its architecture.

## About Docker
Before diving into hands-on examples, for people who first visit this post or people who want to re-check their knowledge of Docker, let’s first check again what Docker Container is.

Docker is a containerization platform that allows applications and their dependencies to be bundled into lightweight containers that can run consistently across different environments. Among all containerization technologies, Docker grow as the best option for developers and enterprises to containerize their applications due to the following factors:

- **Ease of use**: Docker has a user-friendly and easy-to-learn interface that helps manage containers without too much worrying about remembering all the necessary commands making it accessible for both developers and administrators.

- **Portability**: Docker supports all popular OS like Windows, MacOS, and Linus. Furthermore, you can easily run Docker in any environment from the data center to the cloud.

- **Large Ecosystem**: Docker has a massive user base and ecosystem which support all your needed packaged containers through accessing Docker Hub public registry.

- **Lightweight**: Be leverages OS level kernel, Docker does not require OS on each bundled application to run which improves server performance with better start-up time.

- **Isolation & Security**: Each Docker container is highly isolated from the others allowing applications decoupled and run with better security.

## Install Docker
Before involve running any Docker commands, you will need Docker to be installed on your local machine. If your system already has Docker, feel free to skip this part.

### Install Docker on Linux
Update your package manager to ensure it is in the latest state:
```
sudo apt update
```

Now you can install Docker using apt command:

```
sudo apt install docker.io
```
Then you can check whether Docker is installed successfully by running the command:
```
sudo docker --version
```

### Install Docker on Windows and MacOS
For Windows and MacOS, you can download the Docker Desktop at the following [link](https://docs.docker.com/get-docker/).

## Set up your first Docker project
Now your machine is ready to run with Docker, in the rest part of this article, we will work on a to-do-list application that uses ReactJS and build using NPM (node package manager). If you are not familiar with these terms, don’t worry since this tutorial doesn’t require experience with those.

Firstly, you will need the source of the application, start cloning it from the git repository by using the command:
```bash
git clone https://github.com/jimmy706/docker-getting-started.git
```

Now go to the directory of the project: `cd docker-getting-started`

If everything when well, your project folder now will look like this:
```bash
Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a----         5/26/2023   9:36 PM         10 .dockerignore
-a----         5/26/2023   9:12 PM         124 app.py
-a----         5/26/2023   9:34 PM         367 Dockerfile
-a----         5/26/2023   8:57 PM         14 requirements.txt
```
We will see further information about Docker setup in the Dockerfile, use any text editor to open the Dockerfile and you can see the following content:

```yaml
# Base image
FROM python:3.11.3-slim-buster

# Set working directory
WORKDIR /app

# Copy the entire application
COPY . .
RUN pip install --no-cache-dir -r requirements.txt

# Expose the application port
EXPOSE 5000

# Set environment variables
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Start the application
CMD ["flask", "run"]
```
Here is the explanation of what is written in this file:

1. We first start with the base image which is Python in version 3.11.3-slim-buster – A smaller image size python version that can reduce your built-in image size.
2. We then set the working directory inside the container to /app
3. Next, we copy all the contents in the project file, _excluding the files that are listed on `.dockerignore` file_.
4. We then run the install command to download all required dependencies for running the app.
5. We tell Docker the port of the Flask application will run. In this case, is port 5000.
6. We set environment variables for the Flask application. In this example, we set FLASK_APP to app.py (the entry point of the Flask app) and FLASK_RUN_HOST to 0.0.0.0 to make the Flask app externally accessible.
7. Finally, we tell Docker that we want to run the flask command to start the application.

## Build the Docker Image
Now once you understand what instruction we want Docker to do in Dockerfile, you can run the following command to build the application into a Docker Image:
```
docker build -t docker-getting-started:1.0.0-SNAPSHOT .
```

The `docker build .` command will build a new Docker Image when it found the Dockerfile inside your project. Then the `-t` flag will tell Docker that you will name the created image **docker-getting-started** with version **1.0.0-SNAPSHOT**.

Wait a few seconds for Docker to download dependencies and bundle the application, you then can check if the image is created using the command: `docker images`


```
REPOSITORY              TAG              IMAGE ID       CREATED         SIZE
docker-getting-started  1.0.0-SNAPSHOT   630ee222e82c   6 minutes ago   136MB
```

## Run the Docker Image
The final step is to start your Docker Image using docker run command:
```
docker run -p 5000:5000 --name hello-app docker-getting-started:1.0.0-SNAPSHOT
```

The above command map the exposed port 5000 of the virtualized container to your real port on your local computer.

We will name the running container **hello-app** for easier to track it.

Let’s check if our application is up and running using docker ps. If everything when well, you will see the following information:

```bash
CONTAINER ID   IMAGE COMMAND CREATED STATUS PORTS NAMES
9d5f37a9c5d7   docker-getting-started:1.0.0-SNAPSHOT   "flask run" 25 minutes ago   Up 2 seconds   0.0.0.0:5000->5000/tcp   hello-app
```

Then you can go to your [http://localhost:5000](http://localhost:5000) to see the result:


![http://localhost:5000](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/hwy2ttlcx6fcdhl23g6k.png)


## Remove the running container
You can now run the simple application using Docker. To stop the application you can run the command: `docker stop hello-app`

Then you can easily remove this container by running the following command:
```
docker rm hello-app
```

Check again if the container is stopped using `docker ps` and now you can see your container will not display on the terminal.

---
That’s it for the tutorial, thank you for reading. I hope this one can help you understand basic Docker fundamentals. If you like this article, feel free to like and share it to spread more knowledge.

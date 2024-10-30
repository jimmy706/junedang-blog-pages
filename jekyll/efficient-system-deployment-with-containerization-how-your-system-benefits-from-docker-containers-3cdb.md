Continuing from our previous [article](https://junedang.com/an-evolution-story-of-software-deployment-from-dedicated-server-to-containerization/) on the evolution of software deployment, we now turn our attention to the remarkable benefits brought about by containerization—a concept that has revolutionized the tech world. Containerization has been used for a while now from its buzz to describe a system virtualized environments to run applications, offering unparalleled flexibility and lightweight execution.

In this story, let’s we will discuss one of the most popular tools used in the containerization realm: Docker Containers. We will unravel what is Docker, why you should use it, and the key concepts of Docker.

## Understanding Containerization
With the people who first time come to this article and are not yet clear about what containerization is, here I will give some brief explanation before we head into other sections.

Containerization is a technique that bundles an application and its dependencies into a single virtualized unit called the _container_. By abstracting at the operating-system level, containerization only requires a small number of resources to run while bringing better control over the virtualized environment you want to bundle.

## Docker Container?
Among all containerization technologies, [Docker](https://www.docker.com/get-started/) grow as the best option for developers and enterprises to containerize their applications due to the following factors:

**Ease of use**: Docker has a user-friendly and easy-to-learn interface that helps manage containers without too much worrying about remembering all the necessary commands making it accessible for both developers and administrators.

- **Portability**: Docker supports all popular OS like Windows, MacOS, and Linus. Furthermore, you can easily run Docker in any environment from the data center to the cloud.
- **Large Ecosystem**: Docker has a massive user base and ecosystem which support all your needed packaged containers through accessing [Docker Hub](https://hub.docker.com/) public registry.
- **Lightweight**: Be leverages OS level kernel, Docker does not require OS on each bundled application to run which improves server performance with better start-up time.
- **Isolation & Security**: Each Docker container is highly isolated from the others allowing applications decoupled and run with better security.

## Why use Docker?

You now have a brief understanding of containerization and Docker Containers but may not yet be convinced to use Docker Container for your application deployment process. So let’s have a short story to explain and convincing why you should try Docker for your deployment process.

Imagine you have two applications that are developed both in Java with different versions: one in Java 8 and one in Java 11. Now you want to deploy these 2 applications to your server for testing purposes but facing the issue that one machine barely manages to run two versions of a programming language. You can think of one of the following solutions:

- Using 2 physical machines to run different Java versions.
- Run two different virtual machines on a single physical server.

Both options seem to solve your problem but are bulky and not very cost-effective. Instead, a better third option is you only need a Docker to run two containers, each with a different installed version of Java. This approach eliminates the need for multiple physical machines or resource-intensive virtual machines without too much worrying about the cost and the performance of your application.

## Docker key concepts
To have a further understanding of how Docker improves your system deployment process, let’s deep dive into the architecture and the core concepts of Docker.

### Docker architecture
Docker follows client-server architecture with consists of three main components working together to bring the ability of containerization and help manage containerized applications:

![Docker Architecture](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/o91pewjlwi4njtj4zvjs.png)
- **Docker Daemon**: The Docker daemon, called dockerd, runs as a background process on the host machine. It listens to requests sent from Docker Client to manage and control objects like images, containers, networks, and volumes.
- **Docker client**: This component acts as a command line interface for users to communicate with Docker. Through the Docker client, users can execute a wide range of operations, such as creating and managing containers, building and pushing images, configuring networks, and more.
- **Docker registry**: Docker registry serves as a repository for storing Docker images where the Docker daemon can retrieve required images for running containers. Docker Hub is the public Docker registry which allows anyone can use. Alternatively, organizations can set up their own private Docker registry for enhanced security and control over image distribution.

### Docker components

- **Docker Image**: A Docker Image is a package that included code, runtime environment, dependencies, and libraries needed to run your application. An Image can be created using instruction that is defined in a Dockerfile.

- **Container**: A Docker Container is an instance created from Docker Image that runs on a host machine. Each container is an encapsulation of the application and its dependencies, providing a consistent and reproducible execution environment. Containers run in isolation from others to ensure applications’ reliability and portability across different environments.

- **Dockerfile**: To create a Docker Image, you need to instruct Docker what is the running environment, dependencies, how the code will run, how the application folder be structured, and what version of your application be like. All this related information of your Image is defined in a Dockerfile.

- **Docker Compose**: In some cases, you need to run a bunch of applications like in a microservice network, and need a way to chain them together as multiple Docker Images. Docker Compose can help you achieve this. It is a tool used for defining and managing multi-container Docker applications which allows you to specify the services, networks, and volumes required for your application in a YAML file

- **Volumes**: By default, data inside containers is not persistent and so any changes made are lost when the container is stopped or deleted. To prevent this happen, you can use Docker Volumes to persist data generated by containers or share data between containers

- **Docker Networking**: Each container is isolated from others and the outside world. So if you want to connect to them or make them communicate with each other you need a Docker Network. Docker Networking enables you to define networks, assign containers to networks, and expose container ports to make services accessible.

## Conclusion
Containerization is a game-changer that helps developers easier to manage deployed applications by providing a lightweight and flexible environment. Among all containerization technologies, Docker is one of the best options to containerize your application due to its ease to use and largely supported ecosystem.

---
_Originally published at [junedang.com](https://junedang.com/efficient-system-deployment-with-containerization-how-your-system-benefits-from-docker-containers/) on May 21, 2023._

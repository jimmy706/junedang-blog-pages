---
title: "An evolution story of Software Deployment: From Dedicated Server to Containerization"
date: 2024-10-20T00:00:00+00:00
image: https://1drv.ms/i/s!At4dit9d4kzBl2wdfLKQfWhuSAFF?embed=1&width=660
---

# An evolution story of Software Deployment: From Dedicated Server to Containerization

## From the early day
Let’s assume you are developing an application using Java and want to share the result with your clients to test it out and give early feedback. You then push the code to a centralized repository like GitHub to let your clients clone and test it on their machines.

The steps seem to be great since you have tested the application hundred times on your local machine before delivery to your clients. But suddenly, the clients seem to be not happy and they blame you that the application cannot run and they face weird error messages.

![meme - why application cannot running](https://1drv.ms/i/s!At4dit9d4kzBl22QHh7Ecv14diZB?embed=1&width=660)

Turn out, the clients don’t have the necessary dependencies installed on their machines like yours and so the application cannot work properly. This problem is a common issue with the traditional method of delivery using dedicated physical machines, as _replicating the required environment for applications to run across different machines can be challenging and time-consuming_. Actually, this approach is the only way to deploy applications in the old days. Just imagine how much time and resources have been spent just to make the application run on dedicated servers.

## A better idea to run applications on multi-machines
An emerging solution to get rid of the above problem is using virtual machines (VMs) where applications and their dependencies are deployed inside a virtual machine and these machines are running inside the same physical hardware machine. This process is called virtualization.

VMs solutions help developers get rid of the headache of setting up a running environment for each machine that wants to run their applications. Furthermore, it allows multiple applications with different setup environments to run on the same physical machine which improves resource utilization and enabled easier scaling.

![VMs architecture](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/nf45ch76i8q5896ylnmh.png)

## Problems with Virtual Machine solution
And like other solutions in the tech world, VMs approach, derive from its characteristics, has some drawbacks of its own:

- **The resources used in VMs may not be utilized properly**: When a resource is used to create and run a VM, that storage of disk space is blocked and cannot be used for other purposes besides the VM. In reality, a VM barely uses the full shared resource which leads to resource waste.
- **Running multiple VMs required a significant amount of resources**: VMs are a full OS included with run time environment of applications which can lead to higher pay for the infrastructure.
- **VMs take time to boost up**: Because running and booting an entire OS is a long process that takes some time to complete, the VMs approach can make your application downtime longer than expected.
- **Performance issues**: Because of its infrastructure that abstracts between hardware and virtual machines, VMs performance is generally not as good as real physical machines.

## Containerization to rescue
Enough for the history of the war of deployment on physical machines or virtual machines. A new technology that was introduced in the early 2000s has become the guide for lost developers who suffered from the pain of deploying their applications.

Containerization is a technique that bundles an application and its dependencies to run into a single unit known as a container. While containerization shares similarities with the approach of virtual machines, it provides better performance and is more lightweight. This is because VMs bring the abstraction level of virtualization to the hardware level while containers are abstracted on the OS level and as a result, containers require fewer resources to operate, better control over shared resources, and faster start-up time.

![containerization architechture](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mocpzd6jkfan0me5x78j.png)
One of the most popular implementations of this approach is [Docker](https://docs.docker.com/) which takes all advantages of containerization while keeping the open-source use for individuals and organizations.

## What are the benefits of containerization?
The following are reasons to consider for developers to use it for their application deployment process:

1. **Portability**: Containers are designed to run on any platform that supports the container’s ability which helps developers easier to run applications on different environments whether on local machines or staging productions.
2. **Consistency**: Regardless of the underlying infrastructure, containers can run on any platform without worrying about their setups. This reduces the risk of compatibility problems or unintended errors when running applications on multiple platforms.
3. **Efficiency**: Because share the same OS when running, containers are considered to be more efficient when it’s come to evaluating price cost, and performance.
4. **Security and fault-tolerant**: Each container is isolated from the others and the hosting machine which reduces the risk of data exploitation. Furthermore, isolation helps containers avoid failure domino effect in which one container will not affect the others.
5. **Scalability**: Containers can be scaled horizontally by adding more replications to handle high-traffic requests on demand without altering the underlying infrastructure.

## Challenges you will face when using containerization
While offering many benefits, here are some challenges for your consideration when implementing containerization for your system:

1. **Orchestration**: Managing large numbers of containers can be complex, especially as containers are designed to be ephemeral and can be created and destroyed dynamically.
2. **Networking**: Communication between containers may be challenging since they are considered to be isolated.
3. **Data management**: Containers are designed to be stateless, meaning they do not store data between runs. While this can make them more flexible and easier to manage, it can also create challenges when dealing with stateful applications that require persistent data storage.
4. **Compatibility**: Not all platforms are able to run containers. In addition, some legacy applications may require modifications to work properly with the containerization approach.

## Conclusion
To summarize, although easy to manage, a dedicated server required many configurations related to the application’s dependencies to run the application, and while the virtual machine approach can help overcome this issue, it comes with the cost of performance and boot time.

Containerization presents a new and better approach to deploying applications, with faster start-up times, improved performance, and fault tolerance. Although there are still some challenges that developers may face when deploying containers, such as security, orchestration, and data management, it remains the first-choice approach when it comes to scaling systems and handling faults.

---
Originally published at [junedang.com](https://junedang.com/an-evolution-story-of-software-deployment-from-dedicated-server-to-containerization/) on May 11, 2023.


---
title: Getting started with version control – part 2: Git and basic commands
description: Learn how to use Git in your project and basic commands of Git
date: 2020-11-24
---

# Getting started with version control – part 2: Git and basic commands

In my [previous article](https://dev.to/junedang/getting-started-with-version-control-part-1-what-is-version-control-g28), we learned about what are version control systems and how they work. In this article, we will learn about Git – a distributed version control system. This page will guide you on what is Git, how to use Git in your project, difference between Git and other VCS.

## What is Git?

Git is an open-source distributed version control. It is the most used version control system in today’s tech world due to its ease to learn, security, and fast performance.
Due to its widely used, Git has been supported by many systems from large enterprise applications to open-source projects.

## Prerequire
Before learning how to use Git, let’s view some prerequire to get started with it:
-	Personal computer and internet connection (of course 😉).
-	Basic command line knowledge.
-	You need to have Git on your computer by downloading it [here](https://git-scm.com/downloads).
-	Having a code editor is required. My recommendation is [Visual Studio Code](https://code.visualstudio.com/Download).
That’s all for the requirements. Now let’s grab a cup of coffee and prepare to learn how to use Git.

## Git basic commands
### Config Git with your information
One of the first things, after you installed Git was to config your name and email:
```
git config --global user.name "<your name>"
git config --global user.email “<your email>”
```
Git will use these configs as information about the author who changed the code so that everyone in the same project can contact the author about the changed content.
### Integrate Git within your project
Create your project folder by entering these commands:
```
mkidr <project name>
cd <project name>
```
After you successfully create the project, type in the command git init to create an empty repository in your project folder. The result like the screen below you

![git init](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/y85omydpuo1q8ieiwzjb.png)

Notice that now your project has a _.git_ directory. This folder contains all the information necessary for version control to work like: logs, commits, repository addresses, histories, etc. 
Some important subfolders and files of _.git_ directory are:
•	**hooks**: script files used for executing before or after actions like commit or push. We will learn this in another advanced topic about Git.
•	**objects**: a database folder for Git that store everything from commits, files, etc as hash values.
•	**info**: a folder contains exclude files that you don’t want Git to track on it.
•	**config**: Git local config file.
•	**refs**: contains information about tags and branches.
•	**HEAD**: a file reference to our working branch. By default, it points to master branch.
As you understand about subfolders of .git directory, it is clear to say that this folder is one of the most important folder in your project. Deleting this folder means that you’re going to delete the history of your whole changes. 
That why _.git_ folder mark as a hidden folder to prevent you from accidentally deleting it.

### Tracking file changes and Git’s staging area
Now you have a brief understanding of how Git stores and working. Let’s us going to some basic commands of Git.
Create a new file in your project directory with this command:
`touch index.html`
Now check project’s repository status with command 
`git status`
You can see that there is one untracked file on the screen

![git status](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/cu5micfkwg8qv8djv8gd.png)

This means that your created file is in the repository’s working environment but has not yet been added to the git’s tracking indexes (or staging area).
As in the [previous article](https://dev.to/junedang/getting-started-with-version-control-part-1-what-is-version-control-g28), we knew that VCS has two areas to store data: one in your working directory and one in the repository.
Git has another area called _staging area_, which has many advantages as:
•	An area to review your changes before committing.
•	Easier to deal with merge code conflict.
•	Split up large changes into small, easy-to-read commits.

![Git staging area](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/piszv5nnusaurdm4ogcg.png)

Now to add the file’s content to Git staging area, simply use the command: `git add index.html`
After that, check the repo status again with git status and you see that your created has been tracked.

![](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9npwrnzifpb9ikmoeaty.png)

### Make your first commit
Now to store all your changes in the repository, enter the command 
`git commit -m “my first commit”`
The git commit command tells git that you want to capture the current snapshot on the staging area and store it in your repository. The “m” flag tells Git what is your changed meaning for log purposes.
Your new commit will be pushed to HEAD of the current branch, then the branch will be updated to point to your new change point.
To see all your commit logs, simply type in the command: `git log`

![git commit](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/t5xrermosz9ymi4ym4pd.png)


## Summary
That’s all for today's lesson friend. In summary, you have learned about:
•	Git folder structure and its use.
•	Difference storing environment of Git.
•	Basic commands to integrate with Git.

----
If you like my article, feel free to share and like it to spread the knowledge to everyone.
Check out my other article at https://junedang.com/


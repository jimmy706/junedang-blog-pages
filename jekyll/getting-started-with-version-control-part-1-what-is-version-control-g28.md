---
title: Getting Started With Version Control Part 1 - What Is Version Control
description: What is version control and how it works?
date: 2022-08-01
image: https://miro.medium.com/v2/resize:fit:2000/format:webp/1*pe1_NvIqaBNwOPdcP_a_2Q.jpeg
---

If you are learning how to develop a project and on the path to becoming a developer, you have at least heard a term called "version control" or "source control". In today's article, you will read about what is version control, how it works, and how it benefits a tech project.

## What is version control anyway?

Version control system (VCS) is a system running on your project used for tracking, and managing the changes in your code. You can then use this system to:

- See the changing history of your file.
- Tracking the author of every change in the file.
- Versioning each change of your file.
- Recall any change to its version in the past.

## Version control varieties

### Local Version Control

A long-ago edition of VCS was developed for local-machine that has its database on personal computer.

One of the most popular VCS dedicated to the local machine is called [RCS](https://www.gnu.org/software/rcs/). It works by keeping changed files as patch sets, you can then recall the change at any point of the file by adding the patches.

![Local Control System - source: git-scml](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8t779t79v0nq3joqx39p.png)

### Centralized Version Control

In order to be able to work with multiple persons on the same project, a _centralized version control systems_ (CVCSs) was introduced.

These systems have their own single server containing all versioned files and the history of that project so that every member of the same project can cooperate together.

CVCSs however, have a downside if that single server goes down, nobody can not have their work sync and save their changes to the system. Another con is that if the server is corrupted and all data were deleted without backup, the project will be gone forever.

Some tools that support CVCSs are CVS, Subversion, and Perforce.

![Centralized Version Control Systems - source: git-scm
](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ouuy2pzrnset4gk3j3yh.png)
## Distributed Version Control

For a long time, centralized version control systems were a standard, until the term distributed version control systems (DVCSs). In these systems, users will have their own copied version of the repository they are working on their machine. And thus, if any corruption happens with the main server, any copy of that repository can work as a backup.

Some examples of DVCSs are: Git, Mercurial, Bazaar and Darcs

![Distributed Version Control Systems - source: git-scm](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/i44ayyu22taked96vz1l.png)

## How does version control work?

To get familiar with version control, you should understand some of key concepts of version control like:

repository, diffs, branching, merging…. Let's dig into terms and concepts of version control system to understand how it works:

### Repository

A repository is a directory of your project that uses version control. It contains all of your tracked files and directories.

You can see a repository as the database for tracking and managing all changes you make to the project.

### Working copy

A copy of the file edited by you is called a working copy. Simply say, it's a copy of the original file from the project managed by the repository.

You make an edit to the file and when you are done with the change, simply _commit_ the change into _repository_ and your changes will immediately be stored, other peoples working with you just have to _update_ to be able to sync with your work.


![Repository](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/93t5cv8fmvtqyq420h9y.png)


### Diffs

When you make a _commit_, the change of your file will be versioned on repository. The difference between the old version of the file and the new version you just edited is called "diffs".

Diffs can help you to visualize the changes in the file conveniently. As image below, I just added a new line on the file (visualized by green color).


![Diffs](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5grx2y6gbj9ep4nrv4la.png)

With more advanced tools like [SourceTree](https://www.sourcetreeapp.com/) or [GitFork](https://git-fork.com/), you can even see more detail about the changes on the file in a graphically and user-friendly way.

### Conflicts

When two persons edited and committed on the same file, there likely that they edited the same line of that file and this led to _conflicts._ To be able to sync the change between the two, they must manually resolve the conflict in some ways like:

- Accepting the current version.
- Accepting the incoming version.
- Accepting both changes.

Some modern IDEs like [IntelliJ](https://www.jetbrains.com/idea/) or [Visual Studio Code](https://code.visualstudio.com/) have the ability to help developers resolve conflict easily.

### Branching and Merging

_Branching_ is a feature in version control system that help developers to separate the work from each other and continue on their work without conflict with other changes.

When their work has been done, just simply merge their working branches into the main branch of the project, this is also called _merging._


![Branching & Merging](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/oqph6gx4vic4kr0zb9lf.png)


### Tagging

When coming to a time that you want to mark a specific point of the repository's history as a meaningful label, version control system helps you with a feature called _tagging._

In a normal use case, developers would tag a point as a release version (for example _1.0.0_).

## Why do developers use version control?

For most tech projects, the source code is a precious asset that must be treated carefully by developers. With the ability to versioning, tracking, and managing changes of files in the project, VCS helps programmers prevent human error and can also make everyday work become must more efficient by:

- **Tracking the history of every change on the file** : The history included author, modified date, changes, and change notes. Help developers control the life cycle of the project and can revert any changes to a point in the past if anything wrong happen.
- **Decouple development** : With _branching_ and _merging_ features that can help every member of the project work on their own code without conflict with others.
- **Version control** : VCS makes it easy to release and control version of your project with tagging.
- **Backup** : With the raise of distributed version control systems, now VCS can also help you to back up your code on the internet and work with your code anywhere, anytime.

While it's normal if you develop a small project all by yourself without using version control. It's also a big risk when it's come to multiple

## Which version control tool should you use?

There are many version control systems out there, with one of the most used called Git. It's a distributed version control system that has been trusted by many developers and companies out there.

In the upcoming article, we will learn about how to work with Git on a development project.

Thank you for reading this article. If you enjoy reading this feel free to like and share the knowledge with everyone out there.

Check out my blog for more articles like this at: [https://junedang.com/](https://junedang.com/)

## Reference

[https://www.codebasehq.com/blog/how-version-control-works](https://www.codebasehq.com/blog/how-version-control-works)

[https://homes.cs.washington.edu/~mernst/advice/version-control.html#:~:text=Version%20control%20enables%20multiple%20people,interfere%20with%20another%20person's%20work](https://homes.cs.washington.edu/~mernst/advice/version-control.html#:~:text=Version%20control%20enables%20multiple%20people,interfere%20with%20another%20person's%20work).

[https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control)

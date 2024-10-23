---
title: How to build the culture of delivering clean code
description: best practices to follow so that every member of the development team can count on building a culture of keeping the code clean.
image: https://1drv.ms/i/s!At4dit9d4kzB1khTNHa2zTbyDARE?embed=1&width=256
---

![](https://1drv.ms/i/s!At4dit9d4kzB1khTNHa2zTbyDARE?embed=1&width=1024)

# How to build the culture of delivering clean code

If you are working on the development team and in charge of managing multiple source codes, It’s crucial that you treat those codes with the [utmost care](https://dev.to/junedang/it-requires-more-than-just-coding-for-a-software-engineer-442a) to keep everything on the go. And then over time, the project gets larger and larger and so does your teammate. Now maintaining the cleanness of the codebase can be a challenging and time-consuming task since new joiners with different skills and mindsets can bring a difficulty to the onboarding of delivering code.

Because of that, building a culture that emphasizes the importance of clean code at the beginning is crucial that can ensure the long-term success of your team.

The idea of this article is to list out best practices to follow so that every member of the development team can count on building a culture of keeping the code clean.

## Why you should keep the code clean?

Imagine you are a junior developer who doesn’t know about clean code and you’re working on a functioning system that is being maintained clearly by dedicated developers from your team. Now your manager demands you to give some implementation to the new feature. With your skills, you can then easily implement it and deliver the code on time but because of lacking knowledge about clean code you are unintentionally delivering the unstructured code – which creates a technical debt.

As time passes by, the code you delivered on that date started to propagate and infect the chaos to the system through imitation of other newcomers. Consequently, each subsequent change brings more costs and risks to the project which result in rigidity, fragility, immobility, and lower resilience.

Just like the “Broken Window” Theory which states:

> “Consider a building with a few broken windows. If the windows are not repaired, the tendency is for vandals to break a few more windows. Eventually, they may even break into the building, and if it’s unoccupied, perhaps become squatters or light fires inside.”

 
_So what do we learn from the “Broken Windows” Theory?_

The theory suggests that when one bad behavior happens in a clean and nice place without immediate action to correct it immediately, things can turn bad really quickly as a broken window without fixing is a sign of breaking rules without consequence. When applied to software development, the story gets more straightforward as if someone left the code unstructured without intending to fix it, this can cause the root of entropy within the system and the final result can be the collapse and pull out of control of the entire project which can cost billions every year.

![Economic impact of bad code](https://1drv.ms/i/s!At4dit9d4kzBmXg_pOqN4xefO68A?embed=1&width=1024)

## Detect red flags on your codebase
Since software development is very complex and requires insane detail in craftsmanship skills, the border between clean and functioning features and the rotted ones is hanging on the behavior of developers who maintain that features. For a feature to start running out of control, there are multiple factors which will be listed below:

### 1. Neglect developers
To start the list, I should mention that every failed system is not backed by technical aspects but mainly because of human decisions. Perhaps, this is the most common and sadly the fastest way to destroy the project. No one likes a person who does not want to be responsible for his/her actions.

In software development, if it is not a personal project then you are likely to work with many people then cooperation and communication take key factors to success but these are the people who think their time is so precious that take a look again at what they have written just not worthy – all the entropy comes from this kind of mindset. Avoid this and accept it. No one can write perfect code in a single try.

### 2. Over complexity
Sometimes, developers just want to prove they are Tony Stark in the software development field.

_I am a 10x developer baby!_

And what do they do? Replace the three lines of code with a single nested line with the weird-looking niche syntax of the language you write in. Of course, this approach will confuse the readers, which leaves them with more questions than understanding what you want to deliver. But who cares – The important is you are feeling like a genius right? (Nope)

Overengineering a simple solution will not prove you are a genius. It just verifies the fact that you are not understanding the human factor in software development but rather undermines code quality and maintainability.

### 3. “Let’s guess what this variable means”
For me, one of the most difficult parts of being a programmer is thinking of the name of variables. Good naming variables or functions can easily tell the story to readers about what they are doing. In contrast, bad naming causes it harder to read and even takes longer to understand.

Reading code with poorly named variables is like playing a guessing game where readers have to take all the clues that you are scattered over the source code and piece them together just to understand what you want to do in the feature.

Of course, usually, your bad naming behavior will be stopped during the coding review but let’s be honest: why start the argument that takes time when you can simply just follow the naming convention?

### 4.[Duplication](https://dev.to/junedang/duplication-is-evil-how-to-have-a-less-repetitive-program-with-dry-5dpc), duplication, and duplication
What is important should be shouted out three times. Repeated code can be tempting and maybe you think your code is so supreme that it should exist in multiple places around the entire project. However, just thinking of the consequences when one day the feature’s requirements change and you are in charge of updating those “supreme” codebases?

I am telling you what will happen then: you are likely to miss one or two places of the copied code which is then forced to scan again and fix the second or may third round. This I do not even mention the headache of multiple people joining the task to scan and fix the problem. The time and effort required for this task are not to be underestimated.

Abstractions are challenging and time-consuming but it is worth your time to spend on future maintenance.

## Best practices to build the clean code culture

### 1. Clear definition of clean code
The first and foremost step when you want to create something is to have a clear definition of it. Structuring in source code is a wide area and so it is important to list out how clean the code should be taken care of seriously among members of the development teams to share the same understanding of what constitutes clean code and what goal you want to achieve.

Inspire on popular coding best practice patterns can be good resources for you to define your own version of clean code such as SOLID, [DRY (Don’t Repeat Yourself)](https://dev.to/junedang/duplication-is-evil-how-to-have-a-less-repetitive-program-with-dry-5dpc), and KISS (Keep It Simple, Stupid), etc….

### 2. Code reviews
What is the intent of your code? Show me!

Developing a culture needs community interaction and a code review session is one of those. Usually, a code review activity should have the involvement of two members of the development team where one of them is not the code’s author. Managers of development teams should encourage their developers to code review and send feedback before any changes are delivered to production. Through those activities, a combination of these goals can be achieved:

1. Code quality: People are more careful when sending code to review because they know someone will watch and if the quality is not good then they can be humiliated.
2. Detect defect: [A study of the Cisco Systems Programming](https://static1.smartbear.co/support/media/resources/cc/book/code-review-cisco-case-study.pdf) team has revealed that a review of 200-400 LOC over 60 to 90 minutes should yield 70-90% defect discovery.
3. Learning opportunity: When joining reviewing session, both reviewers and the author can learn from each other the solution for a better way to ensure adherence to coding standards.

### 3. Continually Improve codebase through refactoring
It is a lie to say that the code we deliver will always be perfect. Sometimes, there are moments when the deadline forces us to rush to release one final feature before the scheduled date comes. And these are the time our code mostly will not be in the best shape. Just sometimes, sloppy codes are inevitable. But this is not meaning that you should ignore or tolerate them.

If you find yourself in a situation where clean code is challenging with time and cannot dedicate enough resources to it, just prioritize the demanding feature ahead but keep notes or comments where you leave unstructured code for future refactoring.

Additionally, a regular checkup can be worth a try to keep the code clean and reduce the impact of possible rotten code. Remember, even when you do not always achieve perfection in delivering code, a mindset of striving for a cleaner codebase can be helpful for the [productivity](https://dev.to/junedang/5-ways-chatgpt-can-skyrocket-developer-productivity-2gg0) of your team in the long time run.

> Every time you are in an area of the code doing work, always leave the code a little cleaner, not a little messier, than you found it. - Uncle Bob

### 4. Enforcing coding standard
Although a clean code delivery mindset should be trained and improved continually between developers, we are humans who are born to make mistakes. Because of that, Guarantee the code generated by humans is perfectly aligned with coding standards or not is challenging. Therefore, in order to achieve consistency in coding style throughout the system require further implementation of automation tools for detecting common mistakes so that they can provide developers with quick feedback as soon as possible without waiting for human interaction to detect the problem.

Common used automated tools to identify bad practices you can consider using like Pylint for Python, ESLint for JavaScript, etc… if you are using CI/CD then consider integrating those tools into your pipeline to check for coding standard violations during development [workflow](https://dev.to/junedang/what-is-trunk-based-development-and-its-benefits-over-gitflow-1caa).

### 5. Reward Clean Code achievements
For a human to get motivated and drive into action, there are two ways: through necessities or [rewards](https://dev.to/junedang/how-gamification-techniques-help-me-build-my-programmer-career-4l4). The same behavior can be applied to clean code best practices to encourage the success rate of structured code that got delivered and reduce the violation of coding standards.

Recognizing and appreciating developers for their effort to keep delivering clean and structured code can help them take pride in their work which then improves and propagate positive culture to the whole organization.

## How much clean code is enough?
While it seems clean code should be a go-to approach that every software developer should follow, it is obvious that always keeping the code clean in every line you write can lead to the headache of burnout because of perfectionism behavior. Nothing is perfect and so in your project, there is always something not right and if you too much focus on immediately fixing the little detail that makes you unhappy – you are likely to miss the deadly which can trade with monetary compensation.

In reality, the concept of how “clean” your code is can vary and depend heavily on your team’s agreement. While keeping the code structured is important, one should consider other factors which can affect the project’s success such as time constraints, resource availability, specific requirements, and the collective skills of team members.

Try seeking the balance between other factors with keeping the code clean and should avoid too focus on perfectionism. Instead, if you see something not clean enough but acceptable to deliver, consider leaving comments for future refactoring. Finally, all I want to say is:

_“A great software should be adaptable and prepared for future changes in both the business and its definition.”_

---

To get the most out of this article, feel free to complete these challenges 👇:

1. Does your organization strive to deliver a clean coder culture or not? If yes, what is the current approach that keeps developers on track with clean coding of your area?
2. Do you believe that clean code is solely the responsibility of individual developers, or should it be a collective effort within a team or organization? Why?


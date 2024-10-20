# Object.assign in TypeScript: An Introduction to Converting Classes

## Situation
Imagine that you are working on calling an API to receive a list of Person. Each Person has their first name, last name and title. Knowing the model received from the backend, you create a model in the frontend side to catch the value received like:
```
type Person {
	title: string;
	first: string;
	last: string;
}
```

Now you have received the data from the backend, it’s time for rendering it into view. The requirement is to _have title, first name and last name ordered in the same row_. Your HTML now looks something like this:

```
<div>{person.title}, {person.first} {person.last}</div>
```

Until now, the code looks fine and everything runs as you expected. But a new UI comes and you have to adapt that kind of HTML layout in other components. Things look a little duplicate here so you decide to reuse the template by setting a method in `Person` type. You change Person type to a class and add a method `getInfo` so that the template can be reused in your components. The code now looks like this:

```
class Person {
	title: string;
	first: string;
	last: string;

	getInfo(): string {
		return `${this.title}, ${this.first} ${this.last}`;
	}
}
```

By using a class, now your components can reuse the template by calling `getInfo()` method:

```
<div>{person.getInfo()}</div>
```

The problem with this approach is that unlike Java, data serialized from JSON to JavaScript code only mapped to fields not to methods and so when you try to run the above code, you are likely to receive an error `getInfo` is not a function.

## Solution
In order to solve this problem, `Object.assign` provides a way to map data to the class constructor. By using `Object.assign`, you can convert a plain object to a class instance and all the fields in the object will be assigned to the class fields. Therefore, you can call an instance method, in this case `getInfo`, after mapping the data. You can use `Object.assign` like this:

```
let person = Object.assign(new Person(), data);
```

Now you can use the person instance to call getInfo method:

```
<div>{person.getInfo()}</div>
```

This approach helps you to reuse the template and avoid duplicate code.

---
In this article, you learned how to cast plain object data to a class in TypeScript. If you found it useful, please consider liking and sharing it to help spread the knowledge.

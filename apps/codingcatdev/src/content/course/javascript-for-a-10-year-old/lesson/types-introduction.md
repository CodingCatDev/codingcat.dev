---
cloudinary_convert: false
published: draft
slug: types-introduction
title: Types - Primitives, Variables,  Statements
---

## Types

Any value in JavaScript is considered a type. There are 7 primitive data types in the JavaScript language. All primitives are `immutable` , meaning that they cannot be changed. Remember this difference as we start talking about [variables](Types%20-%20Primitives,%20Variables,%20Statements%20b48f188f683c4f7a94c40b626576c35c.md) below. Where a primitive can be assigned to a variable we often say things like “updating the string”, when in reality you are reassigning the variable a new value not updating the actual primitive.

If you ever want to remember these you just need to think about how snobby you are feeling. I know this sounds pretty weird but there is a fun acronym to remember our types by `SNOBNUS` if you sound it out makes it sound like snob in us.

1. string - character based value
2. number - numeric value with and without decimals
3. object - object is special because every value in JavaScript is an object. Most commonly you can think of this as something have 
4. boolean - true or false
5. null - empty
6. undefined - not a value, never been assigned one
7. Symbol - this is a guaranteed unique identifier, you will most likely not use this unless you are writing libraries with private object properties.

## Primitives

A very important aspect of primitives to remember is that they are immutable. That is a really fancy way of saying that you cannot change them. If you take nothing away from that, just think of this fancy cat below. You can’t change him he was born that way!

![https://media.giphy.com/media/TBddd797slSxO/giphy.gif](https://media.giphy.com/media/TBddd797slSxO/giphy.gif)

We will get further into what a variable is, but try this out in the browser. Notice below how you didn’t actually change the string primitive `aj` when you called `toUpperCase()` , but you can assign a new value to the variable.

```jsx
let fancyCat = "aj";
console.log(fancyCat); // aj
fancyCat.toUpperCase(); // AJ
console.log(fancyCat); // aj

fancyCat = fancyCat.toUpperCase(); // Created a new value and assigned    
console.log(fancyCat); // AJ
```

## Variables

In order to truly understand JavaScript you need to understand how to create and maintain data. Variables are essential in every programming language, they offer a place to store values. Variables are used to assign everything from numbers to functions.

## Declaring Variables

In order to assign different types to variables you need to declare them. Originally there was only a declaration called `var`. In the newer syntax additional declarations where added which include `let` and `const`. 

In order to declare variables you must first give them the declaration type like `var` followed by a name like `animal`. By default all declared variables have a value of type `undefined`. You can think of `undefined` as something that never existed and was never assigned. We will get into this type further in our types section.

For example if we make the declaration below to create the variable `animal` and then `console.log` this, you will see that the value is `undefined`;

```jsx
var animal;
console.log(animal);
```

Instead of creating a variable that will be `undefined` it is common to declare a variable with an assigned value. In the code snippet below you will see that we are now assigning a `string` (one of our types that we will cover later in this section) ”cat” to our variable named `animal`.

```jsx
var animal = 'cat';
console.log(animal);
```

> Reminder in order to see the developer tools in Chrome you can hit (command + option + i) or (ctrl + alt + i).
> 

If you are following along please open `2-Types/1-Variables-and-Statements.html` in your browser and open developer tools to view the console.

![Screen Shot 2022-06-26 at 8.59.25 AM.png](https://media.codingcat.dev/image/upload/v1657636588/main-codingcatdev-photo/e008446b-a75c-415d-9ddf-1b8ed3b8ddff.png)

![Screen Shot 2022-06-26 at 9.03.49 AM.png](https://media.codingcat.dev/image/upload/v1657636589/main-codingcatdev-photo/9cc6cb8e-d1b6-48a6-898f-2c04f1660340.png)

For a little extra credit, because we declared animal in the global scope, you can also type `animal` in the console and it will print the last value that was assigned. What did it output? 

When declaring variables in JavaScript they must begin with a letter, an underscore `_` , or dollar sign `$`. In common practice variables are camelCase and start with a lowercase letter and each word after that will be uppercased like `var myBlackCat`. Some companies will also require that `const` variables are all uppercase like `const MYBLACKCAT`. 

### var

You will use the variable declaration `var` when you need to update the value of what is assigned later on in your program. This is useful if you want to do something like addition throughout your program and you want to show the user their new total.

```jsx
var willbe10 = 1;
console.log('willbe10 is', willbe10); 
willbe10 = 1 + 9;
console.log('willbe10 is now', willbe10); 
```

`var` variables are known as function scoped variables.

### let

There is a very slight difference between `var` and `let`, you will use them in very much the same way however `let` variables are known as block scoped variables. 

### const

The variable declaration statement for `const` does not allow for a new value to be assigned (hence the name constant). Try writing the above statement but use `const` instead of `var` and see what happens.

```jsx
const const1 = 1;
console.log('const1 is', const1); 
const1 = 1 + 9;
console.log('const1 is now', const1);
```

You should see a JavaScript error like below telling you what was wrong as well as the exact file and line location of the error.

![Screen Shot 2022-06-26 at 9.49.21 AM.png](https://media.codingcat.dev/image/upload/v1657636589/main-codingcatdev-photo/4fc885bf-8926-4bd1-9689-7097ffb87f8f.png)

## Statements

In the above examples when we wrote both `var animal = 'cat';` and `console.log(animal);` these are known as statements, notice how they both end with a semicolon. Statements can cross multiple lines within a program, but each statement completes an action within the JavaScript interpreter. Statements can cross multiple lines within a program and are often done this way on purpose to make the code more human readable.

> Technically you do not need semicolons but we will use them for clarity, this is also common practice.
> 

Each of our examples are different types of statements

- `var animal = 'cat';`  - variable declaration
- `console.log(animal);` - function call statement

There are several types of statements within JavaScript and we will cover a great deal of them throughout our course.

### Code Blocks

There are also statements that require the use of code blocks. Code blocks are represented with curly braces `{}` . Code blocks are used so that the code represented in this block is complete set of functionality all to itself.

The example below shows a simple code block called an if statement.

```jsx
const cat = 'cat';
const dog = 'dog';

if(cat !== dog){
	console.log('Hey those animals are different');
}
```
---
cloudinary_convert: false
id: 2105340a6b794de9b167b42341381b9d
published: draft
slug: types-strings
title: Types - Strings
---

You can think of primitive types like atoms in our body, there is nothing smaller. Okay well technically [Quarks](https://www.sciencenewsforstudents.org/article/scientists-say-quark#:~:text=Quark%20(noun%2C%20%E2%80%9CKWARK%E2%80%9D)&text=Subatomic%20means%20%E2%80%9Csmaller%20than%20an,even%20smaller%20particles%20called%20quarks.) but you get the idea. These are the basis of what all other data is made.

## string or String

This gets people caught up every time when learning JavaScript. The lowercase “s” makes a world of difference in JavaScript. Lowercase means that we are talking about an actual primitive this means it is not an object and has no methods or properties. 

Yeah but if you have written anything past a `Hello World` you probably have seen that a string does have methods on it like `toUpperCase()`. So what gives? 

JavaScript does this crazy thing called “autoboxing”! It is really a pretty cool magic trick! 

![Oh so magical!](https://media.giphy.com/media/3o84U6421OOWegpQhq/giphy.gif)

Oh so magical!

So what does “autoboxing” actually do? JavaScript is adding an associated wrapper object around your `string` primitive and accessing that object instead. In the code example below you can see that we are able to use `toUppercase()`  immediately.

```jsx
console.log("you should be yelling".toUpperCase()); // 'YOU SHOULD BE YELLING'
```

So this is where the uppercase “S” starts to become a factor. It is the associated object for the `string` primitive. 

## String

A string simply put is a sequence of characters used to represent text. In order to create a string you can use single or double quotes and back ticks. See the below code for examples.

```jsx
const string1 = "cat"; // A string literal
const string2 = 'cat'; // A string literal
const string3 = `cat`; // A string template
const string4 = String("cat"); // A string literal
const string5 = new String("cat"); // A string object
```

I have been a web developer for 20 years and **no one** uses `String()` to create a literal!

## String Concatenation

At times you will need to write a really long line of text for a string. In coding however it is really hard to read text that continues past your editors window, so you need a way to use multiple lines. This can be handled by either use `+` or `\`. 

```jsx
const longString1 = "One summer day, a cat decides to go to" +
"the beach. On her way she goes through many adventures and" +
"meets many people."
const longString2 = "One summer day, a cat decides to go to \
the beach. On her way she goes through many adventures and \
meets many people."
```

## Template Strings (**Template literals)**

To use templates strings use the back tick ``` . This will still create a string but it will also allow you to use expressions by using `${expression}`. See the below code example where we add all the cats in our house and barn then show this evaluated expression in the string. Template strings also include any space and indentations that are used, you will notice in the output it is on two separate lines.

```jsx
const house = 2;
const barn = 8;
console.log(`We have ${house + barn} cats 
total on our property.`);

// We have 10 cats 
//      total on our property.
```

## Common String Methods and Properties

### length

Probably one of the most used properties is `length`. Below we log this out to the console. Notice that this will say the length is 24, but there are only 19 letters. So what gives? When you look at a string it isn’t just the characters that matter it is every position that is taken up within the string. So in this case it is 19 letters + 4 spaces + 1 punctuation = 24.

```jsx
const stringlength = "how long is this string?";
console.log(stringlength.length); // 24
```

### charAt()

If you need to locate a specific position within a string and return the value you can use `charAt(index)`. An example would be that you want to get the first character in an array of strings. In order to find the last character in a string you can pass the string’s length minus 1. Like most things, including your birth, we start at 0 this method too starts at the 0 position

![https://media.giphy.com/media/r0q8JfQLzevKR24Anc/giphy.gif](https://media.giphy.com/media/r0q8JfQLzevKR24Anc/giphy.gif)

```jsx
const letters = "abcdefghijklmnopqrstuvwxz";
console.log("first letter", letters.charAt(0)); // a
console.log("last letter", letters.charAt(letters.length - 1)); // z
```

### at()

> I use this method all the time, but you need to be careful because it is newer. It is supported in all major browsers but in Node.js it was introduced in 16.
> 

 A really awesome use of at is the backward lookup feature. Putting a negative number like `at(-1)` will give you the character from the end of the string.

```jsx
const letters = "abcdefghijklmnopqrstuvwxz";
console.log("first letter", letters.at(0));
console.log("last letter", letters.at(-1));
```

### includes()

Includes does exactly what it says, it finds if a substring (or set of characters) is found in the string and returns `true` or `false` (this is known as a boolean).

```jsx
const sentence = "The small black cat walked in the woods";
console.log("Is cat in sentence: ", sentence.includes("cat")); // true
```

### replaceAll()

Changes all occurrences of a search string with a replacement string. In this example it finds “black” and changes them to “purple” and returns the new string; You can also use `replace()` but it will only find the first occurrence.

```jsx
const purple = "The small black cat walked in the dark black woods.";
console.log("black should be purple: ",sentence.replaceAll("black", "purple"));
```

### slice()

Extracts a section of a string between two indexes and returns a new string.

```jsx
const getCat = "The small black cat walked in the dark black woods.";
console.log("getCat", getCat.slice(16, 19)); // cat
```

### split()

Returns an array of strings populated by splitting the calling string at occurrences of the substring `sep`.

```jsx
const sepStrings = "The small black cat, walked in the dark black woods.";
console.log(
  "return an array of two strings by using comma to separate:",
  sepStrings.split(",")
); // ['The small black cat', 'walked in the dark black woods.']
```

## Finding all the properties and methods

So how many methods and properties are there on the String object? An easy way to find out is to try typing your name as a string into the console on your browser’s dev tools then add a period and find all of them!

![Untitled](https://media.codingcat.dev/image/upload/v1657636587/main-codingcatdev-photo/f6a4b482-e646-44aa-bdc0-6b9fc2f4e06a.png)

> You can find the full compatibility chart on [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#browser_compatibility).
>
# 🏝️TeroyJS

### _"Keepin' it vanilla."_

[![Global support: 87.96%](https://img.shields.io/badge/global%20support-87.96%25-brightgreen)](https://caniuse.com/#feat=mdn-javascript_operators_spread_spread_in_object_literals)  ![GitHub file size in bytes](https://img.shields.io/github/size/MathiasWP/TeroyJS/Teroy.min.js) ![npm](https://img.shields.io/npm/v/teroy)
&nbsp;

## **_What is TeroyJS?_**

TeroyJS is a state-based component UI renderer library made up of 100 lines of code; Create components with states, and watch how they automatically are update in your GUI whenever they are changed.

&nbsp;

## **_Why should i use TeroyJS?_**

First of all, let me make one thing clear: this is **not** in any way a comparable alternative to other frameworks like React, Vue, Angular etc. However, TeroyJS is an option for the times when you can ask yourself: _"Do i really need a big framework like React or Vue for this small, simple thing(s)?"_. Teroy can also be a worthy alternative for people that like coding their applications in mostly Vanilla JavaScript.

TeroyJS focuses mainly on one thing: **size**. A minified TeroyJS takes only 2 750 bytes (2.75kb, 1.36kb gzip) of space on your webpage, which clears up a lot of room for you beautiful code instead. TeroyJS also works silently behind the scenes with the power of JavaScript Proxies and will only update the nescessary DOM-components on state changes. There's no virtual DOM (like in React), and the speed of TeroyJS is not limited by thousands of line with code. In other words:

TeroyJS is very lightweight and reactive.

&nbsp;

## **_How do i install TeroyJS?_**

### With NPM 📦:

#### `npm install teroy`

&nbsp;

### With CDN 🌐:

#### `<script src="https://cdn.jsdelivr.net/npm/teroy@0.2.0"></script>`

&nbsp;

### Locally 📁:

#### `<script src="path/to/teroy.min.js"></script>`

&nbsp;

## **_How do i use TeroyJS?_**

TeroyJS's [API](#api-) is very minimalistic and straight-forward (there are only so many features you can add with 100 lines of code). Here's an example of how to create a web-component with some different states:

```js
const myComponent = new Teroy("#app", {
  render() {
    return `<h1>${this.data.maintitle}</h1>
            <p id=${this.data.id}>Here's todays shopping list:</p>
            <ul>
              ${this.data.shoppingList.items.map((listItem) => `<li>${listItem}</li>`).join("")}
            </ul>`;
  },

  data: {
    maintitle: "This is my big header",
    id: "undertitle",
    shoppingList: {
      items: ["Milk", "Egg", "Flour", "Beer"],
    },
  },
});

myComponent.show();
```

As you can see is TeroyJS a good match with template literals (highly adviced to use these). You can probably also spot that TeroyJS's potential is best utilised together with Vanilla JavaScript. Instead of filling TeroyJS up with lots of features and helper-functions, has most of the "practical" programming been left to you. That's because the real use and potential of TeroyJS comes when combined with VJS. Here's an example of how to create a to-do list that disables itself when there's 10 or more items in the list:

```js
const myComponent = new Teroy("#app", {
  render() {
    return `<h1>${this.data.title}</h1>
            <input id="input" ${this.data.disabled}>
            <button id="button" ${this.data.disabled}>Add to list</button>

            <ul>
              ${this.data.list.map((listItem) => `<li class="item">${listItem}</li>`).join("")}
            </ul>`;
  },

  data: {
    title: "To-do List",
    disabled: "",
    list: [],
  },
});

myComponent.show();

myComponent.select("#button").addEventListener("click", () => {
  const inputValue = myComponent.select("#input").value;
  myComponent.data.list.push(inputValue);

  if (myComponent.data.list.length >= 10) {
    myComponent.data.title = "Done List!";
    myComponent.data.disabled = "disabled";
  }
});
```


TeroyJS also updates the properties and attributes of rendered items when their data changes. TeroyJS also works with nested objects/arrays - as well as assigning these to their own variables:

### NOTE FOR ASSIGING "data" PROPERTIES TO THEIR OWN VARIABLES:

**Whenever you decide to assign a property from the components data-object follow this one rule:**

All variables created has to be a `const`. This is to make sure that the correct types of properties are assigned.
As you can see in the full example below is it possible to assign the Array `todos` to its own variable. However, the property
`listTitle` cannot be assigned to its own variable because it not an Array or Object. If it is, then changing its value will not be updated in `data`.
Therefore by creating all variables with `const` can you make sure that no shady business can happen. So if you want to update the `listTitle` value so
that it also updates in the UI do it like this:

```js
const todos = myComponent.todos;
todos.listTitle = "My new title"
```

### Full example:

```js
const myComponent = new Teroy("#app", {
    render() {
        return `
            <h3>${this.data.todos.listTitle}</h3>

            <ul>
                ${this.data.todos.todosList.map(item => 
                    `
                     <li class="item" id="${item.id}" ${item.complete ? "data-is-complete" : ""}>
                     ${item.name} ${item.complete ? "X" : ""}
                     </li>
                    `).join('')}
            </ul>
            `;
    },

    data: {
        todos: {
            listTitle: 'To-do list',
            todosList: [{ name: 'Chips', complete: false, id: Date.now().toString() }]
        }
    },
});

myComponent.show();


const todos = myComponent.data.todos
const list = myComponent.data.todos.todosList

const addItems = setInterval(() => {
    list.push({ name: 'Beer', complete: false, id: Date.now().toString() })

    if (list.length > 5) {
      todos.listTitle += ' done!'
      clearInterval(addItems)
      }
}, 500);

document.addEventListener('click', e => {
    if (!e.target.matches('.item')) return;
    const item = list.find(i => i.id === e.target.id)

    item.complete = !item.complete;
})
```

As you probably can notice is there a lot of Vanilla JavaScript needed compared to other frameworks when working with TeroyJS. 
That's one of the main reasons as why TeroyJS is not an respective alternative for other frameworks like Vue or React when working with large, scalable applications. However, there are still some use-cases where maybe you'd want to use TeroyJS instead.

**I'd say the use cases for TeroyJS are:**

- You like working with Vanilla JavaScript.
- Your project is small or simple, so you want a very fast and fast-to-setup component-renderer.
- Only a handful of the components in your UI needs to be state-reactive.
- You like working with Vanilla JavaScript.

&nbsp;

# API 🧬

## Core-setup

The Teroy class takes in two parameters. Both of these are required:

**1. Selector** (string)

**2. Component-object** (object)

```js
const component = new Teroy("#app", {});
```

&nbsp;

## Component-object

The component object takes in two items:

**- render()** (function)

**- data** (object/array)

The render() function is required, and has to return a string of the components HTML.
The data object is voluntary, but **must** have the name **"data"** if used.

```js
const component = new Teroy("#app", {
  render() {
    return "<h1>My title</h1>";
  },
  data: {
    myList: ["foo", "bar"],
  },
});
```

&nbsp;

## Teroy functions

**- show()** (renders the component within the selector)

**- select(`selector`)** (a shorthand "querySelector()" for items within the component)

**- selectAll(`selector`)** (a shorthand "querySelectorAll()" for items within the component)

```js
const component = new Teroy("#app", {
  render() {
    return `<h1 id="title">My title</h1>
          ${this.data.myList.map((item) => `<p class="thingy">${item}</p>`).join("")}`;
  },
  data: {
    myList: ["foo", "bar"],
  },
});

component.show();

component.select("#title").style.color = "blue";

component.selectAll(".thingy").forEach((p) => (p.style.color = "green"));
```

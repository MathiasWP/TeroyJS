# 🏝️TeroyJS

### _"Keepin' it vanilla."_

[![Global support: 93.89%](https://img.shields.io/badge/global%20support-93.89%25-brightgreen)](https://caniuse.com/#feat=proxy) ![GitHub file size in bytes](https://img.shields.io/github/size/MathiasWP/TeroyJS/Teroy.min.js) ![npm](https://img.shields.io/npm/v/teroy) 
&nbsp;

## **_What is TeroyJS?_**

TeroyJS is a state-based component UI renderer library made up of 100 lines of code; Create components with states, and watch how they automatically are updated in your GUI whenever they are updated.

&nbsp;

## **_Why should i use TeroyJS?_**

First of all, let me make one thing clear: this is **not** in any way a comparable alternative to other frameworks like React, Vue, Angular etc. However, TeroyJS is an option for the times when you can ask yourself: _"Do i really need a big framework like React or Vue for this small, simple thing(s)?"_

TeroyJS focuses mainly on one thing: **size**. A minified TeroyJS takes only 1.56kb of space on your webpage, which clears up a lot of room for you beautiful code instead. TeroyJS also works silently behind the scenes with the power of JavaScript Proxies and will only update the nescessary DOM-components on state changes. In other words:

TeroyJS is lightweight and very reactive.

&nbsp;

## **_How do i install TeroyJS?_**

### With NPM 📦:

#### `npm install teroy`

&nbsp;

### With CDN 🌐:

#### `<script src="https://cdn.jsdelivr.net/npm/teroy@0.0.3"></script>`

&nbsp;

### Locally 📁:

#### `<script src="path/to/teroy.min.js"></script>`

&nbsp;

## **_How do i use TeroyJS?_**

TeroyJS's [API](#api) is very minimalistic and straight-forward (there are only so many features you can add with 100 lines of code). Here's an example of how to create a web-component with some different states:

```js
const myComponent = new Teroy("#app", {
  render() {
    return `<h1>${this.data.maintitle}</h1>
            <p id=${this.data.id}>Here's todays shopping list:</p>
            <ul>
              ${this.data.shoppingList.items.map(listItem => `<li>${listItem}</li>`).join("")}
            </ul>`;
  },

  data: {
    maintitle: "This is my big header",
    id: "undertitle",
    shoppingList: {
      items: ["Milk", "Egg", "Flour", "Beer"]
    }
  }
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
              ${this.data.list.map(listItem => `<li class="item">${listItem} X</li>`).join("")}
            </ul>`;
  },

  data: {
    title: "To-do List",
    disabled: "",
    list: []
  }
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

There's lots of use-cases where TeroyJS can be useful, especially when doing asynchronously stuff like fetching data from somewhere else. That's where the true power of UI-updating on state change comes in to play

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
    myList: ["foo", "bar"]
  }
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
          ${this.data.myList.map(item => `<p class="thingy">${item}</p>`).join("")}`;
  },
  data: {
    myList: ["foo", "bar"]
  }
});

component.show();

component.select("#title").style.color = "blue";

component.selectAll(".thingy").forEach(p => (p.style.color = "green"));
```

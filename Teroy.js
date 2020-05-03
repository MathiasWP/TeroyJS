/**
 * Teroy: The smallest JavaScript state-based component UI renderer - "Keepin' it Vanilla."
 * Length: 100 lines.
 * Global support: 93.89% (https://caniuse.com/#feat=proxy)
 * Github: https://github.com/MathiasWP/TeroyJS
 * NPM: https://www.npmjs.com/package/teroy
 * Creator: Mathias Picker.
 * License: MIT
 */

(function () {
  class Teroy {
    constructor(element, component) {
      this.element = document.querySelector(element);

      if (!this.element) throw `TEROY: ${element} not found.`;
      if (!component.render || typeof component.render !== "function") throw "TEROY: No render() function found in component.";
      if (typeof component.render() !== "string") throw "TEROY: Please make sure that the return from the render() function is wrapped in template literals (or any other string primitive).";

      this.html = component.render;
      this.rendered = false;
      this.data = new Proxy(component.data || {}, this.handler());
    }

    handler = function () {
      const component = this;
      return {
        get: (obj, prop) => {
          if (['[object Object]', '[object Array]'].indexOf(Object.prototype.toString.call(obj[prop])) > -1) return new Proxy(obj[prop], component.handler())
          if (component.proxyPaused) return obj[prop];
          if (component.rendered) window.requestAnimationFrame(() => component.update());
          return obj[prop];
        },
        set: (obj, prop, value) => {
          obj[prop] = value;
          component.update();
          return true
        }
      };
    };

    select(selector) {
      return this.element.querySelector(selector);
    }

    selectAll(selector) {
      return this.element.querySelectorAll(selector);
    }

    parse(string) {
      return new DOMParser().parseFromString(string, "text/html");
    }

    show() {
      if (this.rendered) return console.warn("TEROY: Component is already showing on page, no need to show it again.");
      this.DOM = this.parse(this.html());
      Array.from(this.DOM.body.childNodes).forEach(child => this.element.appendChild(child));
      this.rendered = true;
    }

    diffAttributes(newAttrs, oldAttrs, node) {
      if (newAttrs === oldAttrs) return;
      const allAttrs = new Set([Array.from(newAttrs), Array.from(oldAttrs)].map(i => i.name));

      for (const attr of allAttrs) {
        const o = oldAttrs.getNamedItem(attr);
        const n = newAttrs.getNamedItem(attr);

        if (!n) node.removeAttribute(attr)
        else if (!o) node.setAttribute(attr, n.value);
        else if (n.value !== o.value) node.setAttribute(attr, n.value);
      }
    }

    diff(newNode, oldNode, root) {
      if (!oldNode) return root.appendChild(n);
      if (!newNode) return root.removeChild(o);
      if (newNode.isEqualNode(oldNode)) return;

      const OLD_CHILDREN = oldNode.childNodes;
      const NEW_CHILDREN = newNode.childNodes;
      const MAX = Math.max(OLD_CHILDREN.length, NEW_CHILDREN.length);
      let cur_idx = -1;

      while (++cur_idx < MAX) {
        const o = OLD_CHILDREN[cur_idx];
        const n = NEW_CHILDREN[cur_idx];

        if (o === n || o && n && n.isEqualNode(o)) continue;
        if (!o) root.appendChild(n);
        else if (!n) root.removeChild(o);
        else if (n.nodeType !== o.nodeType || n.nodeName !== o.nodeName || n.nodeValue !== o.nodeValue) root.replaceChild(n, o);
        else {
          this.diffAttributes(n.attributes, o.attributes, o);
          this.diff(n, o, o)
        }
      }
    }

    update() {
      this.proxyPaused = true;
      this.DOM = this.parse(this.html.apply(this));
      this.diff(this.DOM.body, this.element, this.element);
      delete this.proxyPaused;
    }
  }
  if (typeof define === "function" && define.amd) define(() => Teroy);
  else if (typeof module !== "undefined" && module.exports) module.exports = Teroy;
  else this.Teroy = Teroy;
}.call(this));

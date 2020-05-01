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

      if (!this.element) {
        throw `TEROY: ${element} not found.`;
      }
      if (!component.render || typeof component.render !== "function") {
        throw "TEROY: No render() function found in component.";
      }
      if (typeof component.render() !== "string") {
        throw "TEROY: Please make sure that the return from the render() function is wrapped in template literals (or any other string primitive).";
      }

      this.html = component.render;
      this.rendered = false;

      this.data = new Proxy(component.data || {}, {
        component: this,
        set(target, prop, val) {
          target[prop] = val;
          this.component.update();
          return true;
        },
        get(target, value) {
          if (this.component.proxyPaused) {
            return target[value];
          } else {
            if (this.component.rendered) {
              window.requestAnimationFrame(() => {
                this.component.update();
              });
            }
            return target[value];
          }
        },
      });
    }

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
      if (this.rendered) {
        return console.warn("TEROY: Component is already showing on page, no need to show it again.");
      }
      this.DOM = this.parse(this.html());

      Array.from(this.DOM.body.childNodes).forEach((child) => {
        this.element.appendChild(child);
      });

      this.rendered = true;
    }

    update() {
      this.proxyPaused = true;

      this.DOM = this.parse(this.html.apply(this));

      const OLDDOMCHILDREN = Array.from(this.element.childNodes);
      const NEWDOMCHILDREN = Array.from(this.DOM.querySelector("body").childNodes);

      const maxLength = Math.max(OLDDOMCHILDREN.length, NEWDOMCHILDREN.length);

      for (let i = 0; i < maxLength; i++) {
        if (!OLDDOMCHILDREN[i]) {
          this.element.appendChild(NEWDOMCHILDREN[i]);
        } else if (!NEWDOMCHILDREN[i]) {
          this.element.removeChild(OLDDOMCHILDREN[i]);
        } else if (
          NEWDOMCHILDREN[i].outerHTML !== OLDDOMCHILDREN[i].outerHTML ||
          NEWDOMCHILDREN[i].wholeText !== OLDDOMCHILDREN[i].wholeText
        ) {
          this.element.replaceChild(NEWDOMCHILDREN[i], OLDDOMCHILDREN[i]);
        }
      }
      delete this.proxyPaused;
    }
  }
  if (typeof define === "function" && define.amd) {
    define(function () {
      return Teroy;
    });
  } else if (typeof module !== "undefined" && module.exports) {
    module.exports = Teroy;
  } else {
    this.Teroy = Teroy;
  }
}.call(this));

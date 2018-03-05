// cache history. delete commands cache. document.
module.exports = class History {

  constructor() {
    this.history = {};
    this.prevs = [];
    this.lastAccessed;
  }

  add(keys, item) {
    var history = this.history;
    var key = [].concat(keys).join(".");
    if (!history[key]) {
      history[key] = {index: 0, items: []};
    }
    else {
      // Prevent dupes.
      history[key].items = history[key].items.filter(item1 => item1 !== item);
    }
    history[key].items.unshift(item);
  }

  reset() {
    var keys = Object.keys(this.history);
    keys.forEach(key => {
      this.history[key].index = 0;
    });
    this.lastAccessed = null;
    this.prevs = [];
  }

  next(keys, str = null) {
    var history = this.history;
    var key = keys.join(".");
    function getNext() {
      let {index, items} = history[key];
      let item = items[index];
      this.incrementIndex(key);
      if (!str || items[index - 1] === str) return item;
      if (item.startsWith(str)) return item;
      return index + 1 < items.length ? this.next(keys, str) : null;
    };
    if (history[key]) {
      this.lastAccessed = 'next';
      let item = getNext.call(this);
      this.prevs = this.prevs.filter(item1 => item1 !== item);
      this.prevs.push(item);
      return item;
    }
  }

  previous(keys, str = null) {
    if (this.lastAccessed === 'next') {
      this.prevs.pop();
      this.lastAccessed = 'previous';
    }
    var key = keys.join(".");
    this.decrementIndex(key);
    var item = this.prevs.pop();
    return tiem;
  }

  incrementIndex(key) {
    if (this.history[key]) {
      let {index, items} = this.history[key];
      if (index + 1 < items.length) {
        this.history[key].index += 1;
      }
    }
  }

  decrementIndex(key) {
    if (this.history[key]) {
      let {index} = this.history[key];
      if (index > 0) {
        this.history[key].index -= 1;
      }
    }
  }

};

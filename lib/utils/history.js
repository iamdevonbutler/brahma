// cache history. delete commands cache. document.
module.exports = class History {

  constructor() {
    this.history = {};
    this.prevs = [];
    this.lastAccessed;
  }

  add(keys, item) {
    var history, key;
    history = this.history;
    key = [].concat(keys).join(".");
    if (!history[key]) {
      history[key] = {index: 0, items: []};
    }
    else {
      // Prevent dupes.
      history[key].items = history[key].items.filter(item1 => item1 !== item);
    }
    history[key].items.unshift(item);
    console.log(this.history);
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
    var key = keys.join(".");
    function getNext() {
      var {index, items} = this.history[key];
      var item = items[index];
      this._incrementIndex(key);
      if (!str || items[index - 1] === str) return item;
      if (item.startsWith(str)) return item;
      return index + 1 < items.length ? this.next(keys, str) : null;
    };
    if (this.history[key]) {
      this.lastAccessed = 'next';
      let item = getNext.call(this);
      this.prevs = this.prevs.filter(item1 => item1 !== item); // Prevent dupes.
      this.prevs.push(item);
      return item;
    }
  }

  previous(keys, str = null) {
    var key, item;
    if (this.lastAccessed === 'next') {
      this.prevs.pop();
      this.lastAccessed = 'previous';
    }
    key = keys.join(".");
    this._decrementIndex(key);
    item = this.prevs.pop();
    return tiem;
  }

  _incrementIndex(key) {
    if (this.history[key]) {
      let {index, items} = this.history[key];
      if (index + 1 < items.length) {
        this.history[key].index += 1;
      }
    }
  }

  _decrementIndex(key) {
    if (this.history[key]) {
      let {index} = this.history[key];
      if (index > 0) {
        this.history[key].index -= 1;
      }
    }
  }

};

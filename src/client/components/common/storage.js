var storage = {
    get: function(key) {
        var item = JSON.parse(localStorage.getItem(key));

        return item;
    },
    set: function(key, value, force) {

        if (force) {
            return localStorage.setItem(key, JSON.stringify(value));
        }

        if (typeof this.get(key) !== 'undefined') {
            return;
        }

        return localStorage.setItem(key, JSON.stringify(value));
    },
    remove: function(key) {
        return localStorage.removeItem(key);
    },
    flush: function() {
        return localStorage.clear();
    }
}

module.exports = storage;
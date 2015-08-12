console.shallowLog = function(){

    var typeString = Function.prototype.call.bind(Object.prototype.toString);

    console.log.apply(console, Array.prototype.map.call(arguments, function(x) {
        switch (typeString(x).slice(8, -1)) {
            case 'Number': case 'String': case 'Undefined': case 'Null': case 'Boolean':
                return x;
            case 'Array':
                return x.slice();
            default:
                var out = Object.create(Object.getPrototypeOf(x));
                out.constructor = x.constructor;
                for (var key in x) {
                    out[key] = x[key];
                }
                Object.defineProperty(out, 'constructor', {value: x.constructor});

                return out;
        }
    }));
}

module.exports = console;
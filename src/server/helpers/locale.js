/**
 *
 * Copyright (c) 2012 Jed Schmidt, http://jed.is/
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */
(function() {
    var Locale, Locales, app, _ref, __slice = [].slice;

    app = function(supported) {
        if (!(supported instanceof Locales)) {
            supported = new Locales(supported);
            supported.index();
        }
        return function(req, res, next) {
            var bestLocale, locales;
            locales = new Locales(req.headers["accept-language"]);
            bestLocale = locales.best(supported);
            req.locale = String(bestLocale.normalized);
            req.rawLocale = bestLocale;
            return next();
        };
    };

    app.Locale = (function() {
        var serialize;

        Locale["default"] = new Locale(process.env.LANG || "en-US");

        function Locale(str) {

            var country, language, match, normalized;

            if (!(match = str != null ? str.match(/[a-z]+/gi) : void 0)) {
                return;
            }

            language = match[0], country = match[1];

            this.code = str;
            this.language = language.toLowerCase();

            if (country) {
                this.country = country.toUpperCase();
            }

            normalized = [this.language];

            if (this.country) {
                normalized.push(this.country);
            }

            this.normalized = normalized.join("-");
        }

        serialize = function() {
            if (this.language) {
                return this.code;
            } else {
                return null;
            }
        };

        Locale.prototype.toString = serialize;
        Locale.prototype.toJSON = serialize;

        return Locale;

    })();

    app.Locales = (function() {

        var serialize;

        Locales.prototype.length = 0;
        Locales.prototype._index = null;
        Locales.prototype.sort = Array.prototype.sort;
        Locales.prototype.push = Array.prototype.push;

        function Locales(str) {

            var item, locale, q, _i, _len, _ref, _ref1;

            if (!str) {
                return;
            }

            _ref = (String(str)).split(",");
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                item = _ref[_i];
                _ref1 = item.split(";"), locale = _ref1[0], q = _ref1[1];
                locale = new Locale(locale.trim());
                locale.score = q ? +q.slice(2) || 0 : 1;
                this.push(locale);
            }

            this.sort(function(a, b) {
                return b.score - a.score;
            });
        }

        Locales.prototype.index = function() {
            var idx, locale, _i, _len;
            if (!this._index) {
                this._index = {};
                for (idx = _i = 0, _len = this.length; _i < _len; idx = ++_i) {
                    locale = this[idx];
                    this._index[locale.normalized] = idx;
                }
            }
            return this._index;
        };

        Locales.prototype.best = function(locales) {

            var index, item, l, languageIndex, locale, normalizedIndex, setLocale, _i, _j, _len, _len1;

            setLocale = function(l) {
                var r = l;
                r.defaulted = false;

                return r;
            };

            locale = Locale["default"];
            locale.defaulted = true;

            if (!locales) {
                if (this[0]) {
                    locale = this[0];
                    locale.defaulted = true;
                }
                return locale;
            }

            index = locales.index();
            for (_i = 0, _len = this.length; _i < _len; _i++) {

                item = this[_i];
                normalizedIndex = index[item.normalized];
                languageIndex = index[item.language];

                if (normalizedIndex != null) {

                    return setLocale(locales[normalizedIndex]);

                } else if (languageIndex != null) {

                    return setLocale(locales[languageIndex]);

                } else {
                    for (_j = 0, _len1 = locales.length; _j < _len1; _j++) {
                        l = locales[_j];
                        if (l.language === item.language) {
                            return setLocale(l);
                        }
                    }
                }
            }

            return locale;
        };

        serialize = function() {
            return __slice.call(this);
        };

        Locales.prototype.toJSON = serialize;

        Locales.prototype.toString = function() {
            return String(this.toJSON());
        };

        return Locales;
    })();

    _ref = module.exports = app, Locale = _ref.Locale, Locales = _ref.Locales;

}).call(this);
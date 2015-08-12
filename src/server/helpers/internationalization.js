
var localizations = [
    { name: 'English (United States)', code: 'en-US' },
    { name: 'English', code: 'en' },
    { name: 'German', code: 'de' },
    { name: 'Spanish (Mexico)', code: 'es-MX' },
    { name: 'Spanish (Spain)', code: 'es-ES' },
    { name: 'Spanish (Chile)', code: 'es-CL' },
    { name: 'Japanese', code: 'ja-JP' }
];

var internationalization = {
    locales: {
        getSupported: function() {
            return localizations;
        },
        getSupportedCodes: function() {
            var out = [];

            localizations.forEach(function(localization) {
                out.push(localization.code);
            });

            return out;
        }
    }
};

module.exports = internationalization;
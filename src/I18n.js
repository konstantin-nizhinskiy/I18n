(function (root, factory) {
    if(typeof define === "function" && define.amd) {
        // the AMD loader.
        define([], function(){
            return (root.i18n = factory());
        });
    } else if(typeof module === "object" && module.exports) {
        // the CommonJS loader.
        module.exports = (root.i18n = factory());
    } else {
        root.i18n = factory();
    }
}(this, function () {
    /**
     *
     * @constructor
     */
    var I18n = function () {
            this.setProperty({
                locale: 'ua',
                localeDefault: 'ua',
                versionJson: +new Date()
            });
        },
        /**
         *
         * @type {string} - locale active now
         * @private
         */
        _locale='ua',
        /**
         *
         * @type {string} - default locale active now
         * @private
         */
        _localeDefault='ua',
        /**
         *
         * @type {string} - default value translation
         * @private
         */
        _defaultValue='',
        /**
         *
         * @type {object} - translations object load
         * @private
         */
        _translations = {},
        /**
         *
         * @type {object} - flags load translations bundle
         * @private
         */
        _bundleFile = {};
        /**
         *
         * @type {object} - Module prefix url
         * @private
         */
        _modulePrefix = {};
    // <%= prototype %>
    return new I18n();
}));
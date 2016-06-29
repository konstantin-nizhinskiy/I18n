(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('i18n', [], function () {
            return root.i18n = factory()
        })
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
                local: 'UA',
                localDefault: 'UA',
                versionJson: +new Date()
            });
        },
        /**
         *
         * @type {string} - local active now
         * @private
         */
        _local='UA',
        /**
         *
         * @type {string} - default local active now
         * @private
         */
        _localDefault='UA',
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
    // <%= prototype %>
    return new I18n();
}));
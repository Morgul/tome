//----------------------------------------------------------------------------------------------------------------------
// Metadata cache of the parsed markdown files.
//
// @module cache.js
//----------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');

//TODO: Convert over to using this: https://github.com/fergiemcdowall/search-index for full-text searching!

//----------------------------------------------------------------------------------------------------------------------

function MetaCache()
{
    this._cache = {};
} // end MetaCache

MetaCache.prototype.exists = function(key)
{
    return key in this._cache;
}; // end exists

MetaCache.prototype.get = function(key)
{
    return this._cache[key];
}; // end get

MetaCache.prototype.set = function(key, value)
{
    this._cache[key] = value;
}; // end set

MetaCache.prototype.filter = function(filter)
{
    return _.filter(this._cache, filter);
}; // end filter

//----------------------------------------------------------------------------------------------------------------------

module.exports = new MetaCache();

//----------------------------------------------------------------------------------------------------------------------
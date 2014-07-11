//----------------------------------------------------------------------------------------------------------------------
// Metadata cache of the parsed markdown files.
//
// @module cache.js
//----------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var lunr = require('lunr');
var logger = require('omega-logger').getLogger('cache');

//----------------------------------------------------------------------------------------------------------------------

function MetaCache()
{
    this._cache = {};
    this._idx = lunr(function()
    {
        this.field('title');
        this.field('body', { boost: 20 });
        this.field('tags', { boost: 10 });
        this.ref('id');
    });
} // end MetaCache

MetaCache.prototype.get = function(key, callback)
{
    callback(this._cache[key]);
}; // end get

MetaCache.prototype.set = function(key, value, callback)
{
    this._cache[key] = value;

    value.id = key;
    this._idx.add(value);

    callback();
}; // end set

MetaCache.prototype.search = function(queryString, callback)
{
    var self = this;
    var results = this._idx.search(queryString);
    callback(_.sortBy(results.map(function(result)
    {
        var doc = self._cache[result.ref];
        return { doc: doc, score: result.score };
    }), 'score').reverse());
}; // end search

//----------------------------------------------------------------------------------------------------------------------

module.exports = new MetaCache();

//----------------------------------------------------------------------------------------------------------------------
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

MetaCache.prototype.all = function(callback)
{
    callback(_.values(this._cache));
}; // end get

MetaCache.prototype.get = function(key, callback)
{
    callback(this._cache[key]);
}; // end get

MetaCache.prototype.getTags = function(callback)
{
    var tags = [];
    _.forIn(this._cache, function(value)
    {
        tags = tags.concat(value.tags || []);
    });

    callback(_.uniq(tags).sort());
}; // end getByTag

MetaCache.prototype.getByTags = function(tags, callback)
{
    var self = this;
    var results = [];
    function filterByTag(tag, docs)
    {
        return _.filter(docs, { tags: [tag] });
    } // end filter ByTag

    _.forEach(tags, function(tag, index)
    {
        results = filterByTag(tag, index == 0 ? self._cache : results);
    });
    callback(results);
}; // end getByTag

MetaCache.prototype.exists = function(key, callback)
{
    callback(key in this._cache);
}; // end exists

MetaCache.prototype.set = function(key, value, callback)
{
    this._cache[key] = value;
    value.id = key;

    this._idx.add(value);

    callback();
}; // end set

MetaCache.prototype.remove = function(key, callback)
{
    this._idx.remove(this._cache[key]);
    delete this._cache[key];

    callback();
}; // end remove

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
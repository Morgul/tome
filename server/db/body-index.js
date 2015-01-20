//----------------------------------------------------------------------------------------------------------------------
// holds all the indices for the wiki search
//
// @module index.js
//----------------------------------------------------------------------------------------------------------------------

var Promise = require('bluebird');
var _ = require('lodash');
var lunr = require('lunr');

var db = require('./../models');

//----------------------------------------------------------------------------------------------------------------------

function BodyIndex()
{
    this._idx = lunr(function()
    {
        this.field('body');
    });

    this._initCache();
} // end BodyIndex

BodyIndex.prototype._initCache = function()
{
    var self = this;

    db.Page.filter()
        .then(function(pages)
        {
            _.each(pages, function(page)
            {
                db.Revision.get(page.revisionID)
                    .then(function(revision)
                    {
                        self.add(revision);
                    });
            });
        })
}; // end _initCache

BodyIndex.prototype.search = function(queryString)
{
    var results = this._idx.search(queryString);

    console.log('got results:', results);

    return Promise.map(results, function(result)
    {
        return db.Revision.get(result.ref)
            .then(function(doc)
            {
                return { doc: doc, score: result.score };
            });
    }).then(function(results)
    {
        return Promise.resolve(_.sortBy(results, 'score'));
    });
}; // end search

BodyIndex.prototype.add = function(doc)
{
    return Promise.resolve(this._idx.add(doc));
}; // end add

BodyIndex.prototype.remove = function(doc)
{
    return Promise.resolve(this._idx.remove(doc));
}; // end add

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    BodyIndex: BodyIndex
}; // end exports

//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
// Page - Special database business logic for working with pages.
//
// @module pages.js
//----------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');

var index = require('./body-index');
var db = require('../models');

//----------------------------------------------------------------------------------------------------------------------

var bodyIndex = new index.BodyIndex();

//----------------------------------------------------------------------------------------------------------------------
// Helpers
//----------------------------------------------------------------------------------------------------------------------

function getByURL(url)
{
    return db.Page.filter({ url: url })
        .then(function(pages)
        {
            return pages[0];
        })
        .then(function(page)
        {
            if(!page)
            {
                throw new db.errors.DocumentNotFound();
            } // end if

            return page;
        });
} // end getByURL

//----------------------------------------------------------------------------------------------------------------------

module.exports =  {
    get: function(url)
    {
        return getByURL(url)
            .then(function(page)
            {
                return db.Revision.get(page.revisionID)
                    .then(function(revision)
                    {
                        page.revision = revision;
                        return page;
                    });
            });
    },

    getByTags: function(tags)
    {
        return db.Page.filter()
            .map(function(page)
            {
                return db.Revision.get(page.revisionID);
            })
            .then(function(revisions)
            {
                return _.filter(revisions, { tags: tags });
            });
    },

    getAllTags: function()
    {
        return db.Page.filter()
            .map(function(page)
            {
                return db.Revision.get(page.revisionID);
            })
            .then(function(revisions)
            {
                return _.reduce(revisions, function(results, revision)
                {
                    results = results.concat(revision.tags);
                    return results;
                }, []);
            });
    },

    history: function(url, limit)
    {
        return getByURL(url)
            .then(function(page)
            {
                return db.Revision.filter({ pageID: page.id })
                    .then(function(revisions)
                    {
                        return _.sortBy(revisions, function(revision)
                        {
                            return new Date(revision.created);
                        }).reverse();
                    })
                    .then(function(revisions)
                    {
                        var lastIdx = limit || revisions.length;
                        return revisions.slice(0, lastIdx);
                    });
            });
    },

    move: function(oldURL, newURL, user, message)
    {
        return getByURL(oldURL)
            .then(function(page)
            {
                var rev = new db.Revision({
                    userID: user.email,
                    pageID: page.id,
                    url: oldURL,
                    message: message || "Moved '" + oldURL + "' to '" + newURL + "'.",
                    moved: true
                });

                return rev.save()
                    .then(function()
                    {
                        page.url = newURL;
                        page.revisionID = rev.id;

                        return page.save();
                    })
                    .then(function()
                    {
                        // We want to return the same thing as a `get()`.
                        page.revision = rev;
                        return page;
                    });
            })
    },

    revert: function(url, revisionID)
    {
        return getByURL(url)
            .then(function(page)
            {
                return db.Revision.get(revisionID)
                    .then(function(revision)
                    {
                        if(revision.pageID == page.id)
                        {
                            page.revisionID = revisionID;
                            return page.save()
                                .then(function()
                                {
                                    // We want to return the same thing as a `get()`.
                                    page.revision = revision;
                                    return page;
                                });
                        }
                        else
                        {
                            throw new Error("Revision is not for this page!");
                        } // end if
                    });
            });
    },

    store: function(url, data, user)
    {
        return getByURL(url)
            .catch(db.errors.DocumentNotFound, function()
            {
                return new db.Page({ url: url, created: new Date.toString() }).save();
            })
            .then(function(page)
            {
                var rev = new db.Revision({
                    pageID: page.id,
                    url: url,
                    userID: user.email,
                    message: data.message,
                    title: data.title,
                    tags: data.tags || [],
                    body: data.body,
					created: new Date.toString(),
                    prevRevID: page.revisionID
                });

                return rev.save()
                    .then(function()
                    {
                        if(page.revisionID)
                        {
                            db.Revision.get(page.revisionID)
                                .then(function(revision)
                                {
                                    bodyIndex.remove(revision);
                                })
                        } // end if

                        bodyIndex.add(rev);
                    })
                    .then(function()
                    {
                        page.revisionID = rev.id;
                        page.updated = new Date().toString();
                        page.private = !!data.private;

                        return page.save();
                    });
            });
    },

    search: function(query)
    {
        return bodyIndex.search(query);
    },

    exists: function(url)
    {
        return module.exports.get(url)
            .then(function(page)
            {
                return !page.revision.deleted;
            })
            .catch(db.errors.DocumentNotFound, function()
            {
                return false;
            });
    },

    delete: function(url, user, message)
    {
        return getByURL(url)
            .then(function(page)
            {
                var rev = new db.Revision({
                    pageID: page.id,
                    url: url,
                    prevRevID: page.revisionID,
                    userID: user.email,
                    message: message || "deleted page",
                    deleted: true
                });

                return rev.save()
                    .then(function()
                    {
                        if(page.revisionID)
                        {
                            db.Revision.get(page.revisionID)
                                .then(function(revision)
                                {
                                    bodyIndex.remove(revision);
                                })
                        } // end if
                    })
                    .then(function()
                    {
                        page.revisionID = rev.id;
                        page.updated = new Date().toString();

                        return page.save();
                    })
                    .then(function()
                    {
                        return page;
                    });
            });
    }
}; // end module.exports

//----------------------------------------------------------------------------------------------------------------------

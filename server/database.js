//----------------------------------------------------------------------------------------------------------------------
// API that wraps up working with our ORM.
//
// @module database.js
//----------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var Promise = require('bluebird');

var index = require('./index');
var db = require('./models');

//----------------------------------------------------------------------------------------------------------------------
// Users
//----------------------------------------------------------------------------------------------------------------------

var users = {
    get: function(email)
    {
        return db.User.get(email).run();
    },

    store: function(user)
    {
        var userInst = new db.User(user);
        return userInst.save();
    },

    merge: function(user)
    {
        return db.User.get(user.email).run().then(function(userInst)
        {
            return userInst.merge(user).save();
        }).catch(db.Errors.DocumentNotFound, function()
        {
            var userInst = new db.User(user);
            return userInst.save();
        });
    }
}; // end users

//----------------------------------------------------------------------------------------------------------------------
// Pages
//----------------------------------------------------------------------------------------------------------------------

var bodyIndex = new index.BodyIndex(module.exports.pages);

function _getPageID(slug)
{
    return db.Slug.get(slug).getJoin().run().then(function(slugInst)
    {
        return Promise.resolve(slugInst.currentRevision.page.id);
    });
} // end _getPageID

var pages = {
    get: function(slug)
    {
        return db.Slug.get(slug).getJoin().run().then(function(fullPage)
        {
            return fullPage.currentRevision;
        });
    },

    getRevision: function(revID)
    {
        return db.Revision.get(revID).getJoin().run();
    },

    getHistory: function(slug)
    {
        return _getPageID(slug).then(function(pageID)
        {
            return db.Revision.filter({ page_id: pageID }).getJoin().run().map(function(revision)
            {
                revision.body = undefined;
                return revision;
            });
        });
    },

    create: function(slug, page, user)
    {
        var pageInst = new db.Page({});

        return pageInst.save().then(function(pageInst)
        {
            var commitInst = new db.Commit({
                message: page.commit,
                user_id: user.email
            });

            return commitInst.save().then(function(commitInst)
            {
                var revInst = new db.Revision({
                    page_id: pageInst.id,
                    slug_id: slug,
                    title: page.title,
                    tags: page.tags || [],
                    body: page.body,
                    commit_id: commitInst.id
                });

                return revInst.save().then(function(revInst)
                {
                    var slugInst = new db.Slug({
                        url: slug,
                        currentRevision_id: revInst.id
                    });

                    return slugInst.save().then(function()
                    {
                        bodyIndex.add(revInst);
                    });
                });
            });
        });
    },

    update: function(slug, page, user)
    {
        var commitInst = new db.Commit({
            message: page.commit,
            user_id: user.email
        });

        return commitInst.save().then(function(commitInst)
        {
            return _getPageID(slug).then(function(pageID)
            {
                return db.Slug.get(slug).getJoin().run().then(function(slugInst)
                {
                    var oldRevision = slugInst.currentRevision;

                    var revInst = new db.Revision({
                        page_id: pageID,
                        slug_id: slug,
                        title: page.title,
                        tags: page.tags || [],
                        body: page.body,
                        commit_id: commitInst.id
                    });

                    revInst.title = revInst.title || oldRevision.title;
                    revInst.tags = revInst.tags || oldRevision.tags;
                    revInst.body = revInst.body || oldRevision.body;

                    return revInst.save().then(function(revInst)
                    {
                        slugInst.currentRevision_id = revInst.id;

                        return slugInst.save().then(function(slugInst)
                        {
                            // Update our index if we successfully save.
                            bodyIndex.remove(oldRevision);
                            bodyIndex.add(revInst);

                            return slugInst;
                        });
                    });
                });
            });
        });
    },

    createOrUpdate: function(slug, page, user)
    {
        return module.exports.pages.exists(slug).then(function(exists)
        {
            if(exists)
            {
                return module.exports.pages.update(slug, page, user);
            }
            else
            {
                return module.exports.pages.create(slug, page, user);
            } // end if
        });
    },

    delete: function(slug)
    {
        var commitInst = new db.Commit({
            message: page.commit,
            user_id: user.email
        });

        return commitInst.save().then(function(commitInst)
        {
            return _getPageID(slug).then(function(pageID)
            {
                return db.Slug.get(slug).run().then(function(slugInst)
                {
                    var oldRevision = slugInst.currentRevision;

                    var revInst = new db.Revision({
                        page_id: pageID,
                        slug_id: slug,
                        commit_id: commitInst.id,
                        deleted: true
                    });

                    return revInst.save().then(function(revInst)
                    {
                        slugInst.currentRevision_id = revInst.id;

                        return slugInst.save().then(function(slugInst)
                        {
                            bodyIndex.remove(oldRevision);

                            return slugInst;
                        });
                    });
                });
            });
        });
    },

    move: function(slug)
    {
        //TODO: Figure out how to handle this.

        // Step 1: Get the current slug and delete it
        // Step 2: Make a new slug
        // Step 3: Make a new Revision (like update), but with the new slug
        // Step 4: Save as normal
    },

    recentActivity: function(limit)
    {
        return db.Revision.orderBy('commit.committed').limit(limit).getJoin().run();
    },

    search: function(query)
    {
        return bodyIndex.search(query);
    },

    getTags: function()
    {
        return db.Slug.getJoin().run().then(function(slugs)
        {
            var tags = [];
            slugs.forEach(function(slugInst)
            {
                tags = tags.concat((slugInst.currentRevision || {}).tags || [])
            });

            return _.uniq(tags).sort();
        });
    },

    getByTags: function(tags)
    {
        return db.Slug.getJoin().run().then(function(slugs)
        {
            var results = [];
            var revisions = slugs.map(function(slug){ return slug.currentRevision; });

            function filterByTag(tag, docs)
            {
                return _.filter(docs, { tags: [tag] });
            } // end filter ByTag

            _.forEach(tags, function(tag, index)
            {
                results = filterByTag(tag, index == 0 ? revisions : results);
            });

            return results;
        });
    },

    exists: function(slug)
    {
        return new Promise(function(resolve)
        {
            _getPageID(slug).then(function()
            {
                resolve(true);
            }).catch(db.Errors.DocumentNotFound, function()
            {
                resolve(false);
            }).error(function()
            {
                // If something blows up, we count this as nonexistence.
                resolve(false);
            });
        });
    }
}; // end pages

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    users: users,
    pages: pages,
    Errors: db.Errors,
    index: bodyIndex
}; // end exports

//----------------------------------------------------------------------------------------------------------------------
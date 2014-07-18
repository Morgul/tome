//----------------------------------------------------------------------------------------------------------------------
// API that wraps up working with our ORM.
//
// @module database.js
//----------------------------------------------------------------------------------------------------------------------

var Promise = require('bluebird');

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
        return db.Slug.get(slug).getJoin().run();
    },

    getHistory: function(slug)
    {
        return _getPageID(slug).then(function(pageID)
        {
            return db.Revision.filter({ page_id: pageID })
                .orderBy('commit.committed').getJoin().run();
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

                    return slugInst.save();
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
                    var revInst = new db.Revision({
                        page_id: pageID,
                        slug_id: slug,
                        title: page.title,
                        tags: page.tags || [],
                        body: page.body,
                        commit_id: commitInst.id
                    });

                    revInst.title = revInst.title || slugInst.currentRevision.title;
                    revInst.tags = revInst.tags || slugInst.currentRevision.tags;
                    revInst.body = revInst.body || slugInst.currentRevision.body;

                    return revInst.save().then(function(revInst)
                    {
                        slugInst.currentRevision_id = revInst.id;

                        return slugInst.save();
                    });
                });
            });
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
                    var revInst = new db.Revision({
                        page_id: pageID,
                        slug_id: slug,
                        commit_id: commitInst.id,
                        deleted: true
                    });

                    return revInst.save().then(function(revInst)
                    {
                        slugInst.currentRevision_id = revInst.id;

                        return slugInst.save();
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
    }
}; // end pages

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    users: users,
    pages: pages,
    Errors: db.Errors
}; // end exports

//----------------------------------------------------------------------------------------------------------------------
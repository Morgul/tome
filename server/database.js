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

    getCommits: function(email, limit)
    {
        limit = parseInt(limit);
        if(limit)
        {
            return db.Commit.filter({ user_id: email }).getJoin().orderBy(db.r.desc('committed')).limit(limit).run().map(function(commit)
                {
                    commit.revisions.forEach(function(revision)
                    {
                        revision.body = undefined;
                        revision.slug = undefined;
                        revision.page = undefined;
                        revision.title = undefined;
                        revision.tags = undefined;
                    });
                    return commit;
                });
        }
        else
        {
            return db.Commit.filter({ user_id: email }).getJoin().orderBy(db.r.desc('committed')).run().map(function(commit)
                {
                    commit.revisions.forEach(function(revision)
                    {
                        revision.body = undefined;
                        revision.slug = undefined;
                        revision.page = undefined;
                        revision.title = undefined;
                        revision.tags = undefined;
                    });
                    return commit;
                });
        } // end if
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
    return db.Slug.get(slug).run().then(function(slugInst)
    {
        return slugInst.page;
    });
} // end _getPageID

function _getSlug(pageID)
{
    return db.Slug.filter({ page: pageID }).run().then(function(slugInst)
    {
        return slugInst.url;
    });
} // end _getSlug

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

    getHistory: function(slug, limit)
    {
        limit = parseInt(limit);
        return _getPageID(slug).then(function(pageID)
        {
            var query = db.Revision.filter({ page_id: pageID }).getJoin()
                .orderBy(db.r.desc(function(row)
                {
                    return row('commit')('committed');
                }));

            if(limit)
            {
                query = query.limit(limit);
            } // end if

            return query.run().map(function(revision)
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
                        page: pageInst.id,
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
        limit = parseInt(limit);
        var query = db.Revision.getJoin()
            .orderBy(db.r.desc(function(row)
            {
                return row('commit')('committed');
            }));

        if(limit)
        {
            query = query.limit(limit);
        } // end if

        return query.run().map(function(revision)
        {
            revision.body = undefined;
            return revision;
        }).then(function(revisions)
        {
            //FIXME: While this actually works, it's very slow, and will only get slower as time goes on. We need to
            // improve the performance, either by modifying the model, doing direct ReQL queries, or something else.
            return Promise.map(revisions, function(revision)
            {
                return db.Revision.filter({ page_id: revision.page_id }).getJoin().run().then(function(revisions)
                {
                    var sortedRevs = _.sortBy(revisions, function(rev){ return rev.commit.committed; }).reverse();
                    var revIndex = _.findIndex(sortedRevs, { id: revision.id }) + 1;

                    revision.prevRev = (revIndex) < sortedRevs.length ? sortedRevs[revIndex].id : undefined;

                    return revision;
                });
            });
        });
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
// Comments
//----------------------------------------------------------------------------------------------------------------------

var comments = {
    get: function(pageID, group, limit)
    {
        var query = db.Comment;

        if(pageID)
        {
            query = query.filter({ page_id: pageID });
        } // end if

        query = query.getJoin();

        if(group)
        {
            query = query.group('title');
        } // end if

        query = query.orderBy(db.r.desc('created'));

        if(limit)
        {
            limit = parseInt(limit);
            query = query.limit(limit);
        } // end if

        return query.run().map(function(comment)
        {
            return _getSlug(comment.page_id).then(function(slug)
            {
                comment.slug = slug;
                return comment;
            });
        });
    },

    create: function(pageID, title, body, user)
    {
        var comment = new db.Comment({
            page_id: pageID,
            title: title,
            body: body,
            user_id: user.email
        });

        return comment.save();
    },

    update: function(commentID, title, body, resolved)
    {
        return db.Comment.get(commentID).run().then(function(comment)
        {
            comment.title = title;
            comment.body = body;
            comment.resolved = resolved;

            return comment.save();
        });
    },

    delete: function(commentID)
    {
        return db.Comment.get(commentID).delete().run();
    }
}; // end comments

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    users: users,
    pages: pages,
    comments: comments,
    Errors: db.Errors,
    index: bodyIndex
}; // end exports

//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
// Brief description for comment.js module.
//
// @module comment.js
//----------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');

var db = require('../models');

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    get: function(id)
    {
        return db.Comment.get(id);
    },

    getByPage: function(pageID, limit)
    {
        return db.Comment.filter({ pageID: pageID })
            .then(function(comments)
            {
                comments = _.sortBy(comments, function(comment)
                {
                    return new Date(comment.created);
                });

                // Descending order
                comments.reverse();

                return comments;
            })
            .then(function(comments)
            {
                var lastIdx = limit || comments.length;
                return comments.slice(0, lastIdx);
            })
            .then(function(comments)
            {
                return _.groupBy(comments, 'title');
            });
    },

    store: function(commentID, data)
    {
        return db.Comment.get(commentID)
            .catch(db.errors.DocumentNotFound, function()
            {
                return new db.Comment();
            })
            .then(function(comment)
            {
                _.assign(comment, data);
                return comment.save();
            });
    },

    delete: function(id)
    {
        return db.Comment.remove(id);
    }
}; // end exports

//----------------------------------------------------------------------------------------------------------------------
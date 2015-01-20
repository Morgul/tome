// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the comment.spec.js module.
//
// @module comment.spec.js
// ---------------------------------------------------------------------------------------------------------------------

var assert = require("assert");
var _ = require('lodash');
var jbase = require('jbase');

var Comment;

// ---------------------------------------------------------------------------------------------------------------------

describe('Comments API', function()
{

    beforeEach(function(done)
    {
        var comments = jbase.db('comments', { writeToDisk: false, loadFromDisk: false });

        comments.store('comment1', {
                pageID: 'page1',
                userID: 'user1',
                title: "Test",
                body: "This is a test.",
                created: new Date(),
                updated: new Date(),
                resolved: false
            })
            .then(function()
            {
                return comments.store('comment2', {
                    pageID: 'page1',
                    userID: 'user2',
                    title: "Test",
                    body: "This is also a test.",
                    created: new Date(),
                    updated: new Date(),
                    resolved: false
                })
            })
            .then(function()
            {
                return comments.store('comment3', {
                    pageID: 'page1',
                    userID: 'user1',
                    title: "Test 2",
                    body: "This is another test.",
                    created: new Date(),
                    updated: new Date(),
                    resolved: false
                })
            })
            .then(function()
            {
                Comment = require('../../db/comment');
                done();
            });
    });

    describe('#get()', function()
    {
        it('retrieves a comment by id', function(done)
        {
            Comment.get('comment1')
                .then(function(comment)
                {
                    assert.equal(comment.title, "Test");
                    done()
                });
        });
    });

    describe('#getByPage()', function()
    {
        it('retrieves all comments for a page', function(done)
        {
            Comment.getByPage('page1')
                .then(function(comments)
                {
                    assert(!_.isEmpty(comments), "Comments are empty!");
                    done();
                });
        });

        it('groups comments by topic', function(done)
        {
            Comment.getByPage('page1')
                .then(function(comments)
                {
                    assert.equal(comments["Test"].length, 2);
                    assert.equal(comments["Test 2"].length, 1);
                    done();
                });
        });
    });

    describe('#store()', function()
    {
        it('creates a new comment', function(done)
        {
            Comment.store(null, {
                    pageID: 'page2',
                    userID: 'user1',
                    title: "Some Title",
                    body: "This is a test."
                })
                .then(function(comment)
                {
                    assert.equal(comment.title, "Some Title");
                    done();
                });
        });

        it('updates an existing comment', function(done)
        {
            Comment.store('comment2', {
                    resolved: true
                })
                .then(function(comment)
                {
                    assert.equal(comment.resolved, true);
                    done();
                });
        });
    });

    describe('#delete()', function()
    {
        it('deletes existing comments', function(done)
        {
            Comment.delete('comment2')
                .then(function()
                {
                    return Comment.get('comment2');
                })
                .then(function()
                {
                    assert(false, "Comment was found.");
                })
                .catch(jbase.errors.DocumentNotFound, function()
                {
                    done();
                });
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------
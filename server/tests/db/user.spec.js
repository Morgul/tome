// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the user.spec.js module.
//
// @module user.spec.js
// ---------------------------------------------------------------------------------------------------------------------

var assert = require("assert");
var jbase = require('jbase');

var User;

// ---------------------------------------------------------------------------------------------------------------------

describe('User API', function()
{
    beforeEach(function(done)
    {
        var users = jbase.db('users', { writeToDisk: false, loadFromDisk: false });
        var revisions = jbase.db('revisions', { writeToDisk: false, loadFromDisk: false });

        users.store('user1', {
                gPlusID: '1001',
                nickname: 'morgul',
                tagline: 'Godlike Fizzydice',
                email: 'foo@bar.com',
                displayName: 'Chris Case',
                avatar: 'example.com/foo.png',
                bio: "I'm on top of the world!"
            })
            .then(function()
            {
                return users.store('user2', {
                    gPlusID: '1002',
                    nickname: 'FTM',
                    tagline: 'Moar Testing!',
                    email: 'foo2@bar.com',
                    displayName: 'Foobar The Magnificent',
                    avatar: 'example.com/foo2.png',
                    bio: "I'm just a test user."
                });
            })
            .then(function()
            {
                return revisions.store('rev1', {
                    pageID: 'page1',
                    url: '/foo',
                    title: "Foo Page",
                    tags: ['home'],
                    body: "Welcome to the Foo Page!",
                    userID: 'user1',
                    message: "minor edit 1",
                    created: new Date(),
                    moved: false,
                    deleted: false
                });
            })
            .then(function()
            {
                return revisions.store('rev2', {
                    pageID: 'page1',
                    url: '/foo',
                    title: "Foo Page 2",
                    tags: ['home'],
                    body: "Welcome to the Foo Page 2!",
                    userID: 'user1',
                    message: "minor edit 2",
                    created: new Date(),
                    moved: false,
                    deleted: false
                });
            })
            .then(function()
            {
                return revisions.store('rev3', {
                    pageID: 'page1',
                    url: '/foo',
                    title: "Foo Page 3",
                    tags: ['home'],
                    body: "Welcome to the Foo Page 3!",
                    userID: 'user2',
                    message: "minor edit 3",
                    created: new Date(),
                    moved: false,
                    deleted: false
                });
            })
            .then(function()
            {
                User = require('../../db/user');
                done();
            });
    });

    describe('#get()', function()
    {
        it('retrieves a user', function(done)
        {
            User.get('user1')
                .then(function(user)
                {
                    assert.equal(user.gPlusID, 1001);
                    done();
                });
        });
    });

    describe('#getRevisions()', function()
    {
        it('retrieves all revisions owned by the user', function(done)
        {
            User.getRevisions('user1')
                .then(function(revisions)
                {
                    assert.equal(revisions.length, 2);
                    done();
                });
        });
    });

    describe('#store()', function()
    {
        it('creates a new user', function(done)
        {
            User.store(null, {
                    gPlusID: '1003',
                    email: 'foo3@bar.com'
                })
                .then(function(user)
                {
                    assert.equal(user.email, "foo3@bar.com");
                    done();
                });
        });

        it('updates an existing user', function(done)
        {
            User.store('user2', {
                    bio: 'test'
                })
                .then(function(user)
                {
                    assert.equal(user.bio, 'test');
                    done();
                });
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------
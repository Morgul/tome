// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the page.js module.
//
// @module page.spec.js
// ---------------------------------------------------------------------------------------------------------------------

var assert = require("assert");
var jbase = require('jbase');

var Page;

// ---------------------------------------------------------------------------------------------------------------------

describe("Page API", function()
{
    var pages = jbase.db('pages', { writeToDisk: false, loadFromDisk: false });
    var revisions = jbase.db('revisions', { writeToDisk: false, loadFromDisk: false });
    var commits = jbase.db('commits', { writeToDisk: false, loadFromDisk: false });

    beforeEach(function(done)
    {
        pages.store('page1', {
                url: '/foo',
                revisionID: 'rev3',
                created: new Date().toString(),
                updated: new Date().toString()
            })
            .then(function()
            {
                return pages.store('page2', {
                    url: '/foo2',
                    revisionID: 'rev2-1',
                    created: new Date().toString(),
                    updated: new Date().toString()
                })
            })
            .then(function()
            {
                return revisions.store('rev2-1', {
                    pageID: 'pag21',
                    url: '/foo2',
                    title: "Foo2 Page",
                    tags: [],
                    body: "Welcome to the Foo Page!",
                    userID: 'user5',
                    message: "minor edit 1",
                    created: new Date().toString(),
                    moved: false,
                    deleted: false
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
                    created: new Date().toString(),
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
                    prevRevID: 'rev1',
                    created: new Date().toString(),
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
                    userID: 'user1',
                    message: "minor edit 3",
                    prevRevID: 'rev2',
                    created: new Date().toString(),
                    moved: false,
                    deleted: false
                });
            })
            .then(function()
            {
                // We import here, so that we can override the default options to the database.
                Page = require('../../db/page');
                done();
            });
    });

    describe("#get()", function()
    {
        it('should retrieve a page by url', function(done)
        {
            Page.get('/foo')
                .then(function(page)
                {
                    assert.equal(page.url, '/foo');
                    assert.equal(page.revision.id, 'rev3');
                    done();
                });
        });

        it('throws an error on a nonexistent page', function(done)
        {
            Page.get('/dne')
                .then(function()
                {
                    assert(false, "Should have thrown.");
                    done();
                })
                .catch(jbase.errors.DocumentNotFound, function()
                {
                    done();
                });
        });
    });

    describe("#getByTags()", function()
    {
        it('returns a list of revisions that match the given tags', function(done)
        {
            Page.getByTags(['home'])
                .then(function(revisions)
                {
                    assert.equal(revisions.length, 1);
                    assert.equal(revisions[0].url, '/foo');
                    done();
                });
        });

        it('returns an empty list when nothing matches', function(done)
        {
            Page.getByTags(['foo'])
                .then(function(revisions)
                {
                    assert.equal(revisions.length, 0);
                    done();
                });
        });
    });

    describe("#getAllTags()", function()
    {
        it('lists all tags', function(done)
        {
            Page.getAllTags()
                .then(function(tags)
                {
                    assert.deepEqual(tags, ['home']);
                    done();
                });
        });
    });

    describe("#history()", function()
    {
        it('retrieves revision history', function(done)
        {
            Page.history('/foo')
                .then(function(revisions)
                {
                    assert.equal(revisions[0].id, 'rev3');
                    assert.equal(revisions[1].id, 'rev2');
                    assert.equal(revisions[2].id, 'rev1');
                    done();
                });
        });

        it('allows passing a limit', function(done)
        {
            Page.history('/foo', 2)
                .then(function(revisions)
                {
                    assert.equal(revisions[0].id, 'rev3');
                    assert.equal(revisions[1].id, 'rev2');
                    assert.equal(revisions.length, 2);
                    done();
                });
        });

        it('throws an error on a nonexistent page', function(done)
        {
            Page.history('/dne', 2)
                .then(function()
                {
                    assert(false, "Should have thrown.");
                    done();
                })
                .catch(jbase.errors.DocumentNotFound, function()
                {
                    done();
                });
        });
    });

    describe("#move()", function()
    {
        it('correctly moves the page', function(done)
        {
            Page.move('/foo', '/bar', { email: 'user2' })
                .then(function(page)
                {
                    assert.equal(page.url, '/bar');
                    assert.equal(page.revision.moved, true);
                    done();
                });
        });

        it('supports passing in a message', function(done)
        {
            Page.move('/foo', '/bar', { email: 'user2' }, "dude!")
                .then(function(page)
                {
                    assert.equal(page.revision.message, "dude!");
                    done();
                });
        });

        it('throws an error on a nonexistent page', function(done)
        {
            Page.move('/dne', '/bar', { email: 'user2' })
                .then(function()
                {
                    assert(false, "Should have thrown.");
                    done();
                })
                .catch(jbase.errors.DocumentNotFound, function()
                {
                    done();
                });
        });
    });

    describe("#revert()", function()
    {
        it("correctly reverts to a previous revision", function(done)
        {
            Page.revert('/foo', 'rev2')
                .then(function()
                {
                    return Page.get('/foo');
                })
                .then(function(page)
                {
                    assert.equal(page.revision.id, 'rev2');
                    done();
                });
        });

        it("fails if the revision isn't found", function(done)
        {
            Page.revert('/foo', 'rev-dne')
                .then(function()
                {
                    return Page.get('/foo');
                })
                .then(function()
                {
                    assert(false, "Didn't throw error.");
                })
                .catch(jbase.errors.DocumentNotFound, function()
                {
                    done();
                });
        });

        it("fails if the revision is for a different page", function(done)
        {
            Page.revert('/foo', 'rev2-1')
                .then(function()
                {
                    return Page.get('/foo');
                })
                .then(function()
                {
                    assert(false, "Didn't throw error.");
                })
                .catch(function()
                {
                    done();
                });
        });
    });

    describe("#store()", function()
    {
        it("creates a new page when one doesn't exist", function(done)
        {
            Page.store('/foo2',
                { message: "initial commit", title: "Foo2", body: "Foo2 Page." }, { email: 'user2' })
                .then(function(page)
                {
                    assert.equal(page.url, '/foo2');
                    done();
                });
        });

        it('updates a page', function(done)
        {
            Page.store('/foo',
                { message: "update", title: "New Foo", body: "Totes-legit." }, { email: 'user2' })
                .then(function()
                {
                    return Page.get('/foo');
                })
                .then(function(page)
                {
                    assert.equal(page.revision.title, "New Foo");
                    assert.equal(page.revision.body, "Totes-legit.");
                    done();
                });
        });

        it('correctly populates the previous revision', function(done)
        {
            Page.store('/foo',
                { message: "update", title: "New Foo", body: "Totes-legit." }, { email: 'user2' })
                .then(function()
                {
                    return Page.get('/foo');
                })
                .then(function(page)
                {
                    assert.equal(page.revision.prevRevID, "rev3");
                    done();
                });
        });
    });

    describe("#exists()", function()
    {
        it('returns true for an existing page', function(done)
        {
            Page.exists('/foo')
                .then(function(exists)
                {
                    assert(exists);
                    done();
                });
        });

        it("returns false for a page that doesn't exist", function(done)
        {
            Page.exists('/dne')
                .then(function(exists)
                {
                    assert(!exists);
                    done();
                });
        });

        it("returns false for a page that has been deleted", function(done)
        {
            Page.delete('/foo', { email: 'user2' })
                .then(function()
                {
                    Page.exists('/foo')
                        .then(function(exists)
                        {
                            assert(!exists);
                            done();
                        });
                });
        });
    });

    describe("#delete()", function()
    {
        it('deletes the page', function(done)
        {
            Page.delete('/foo', { email: 'user2' })
                .then(function(page)
                {
                    assert.equal(page.revision.deleted, true);
                    return Page.get('/foo');
                })
                .then(function(page)
                {
                    assert(page.revision.deleted);
                    done();
                });
        });

        it('supports passing in a message', function(done)
        {
            Page.delete('/foo', { email: 'user2' }, "test")
                .then(function(page)
                {
                    assert.equal(page.revision.message, "test");
                    done();
                });
        });

        it('throws an error on a nonexistent page', function(done)
        {
            Page.delete('/dne', { email: 'user2' })
                .then(function()
                {
                    assert(false, "Should have thrown.");
                    done();
                })
                .catch(jbase.errors.DocumentNotFound, function()
                {
                    done();
                });
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------
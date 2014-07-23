// ---------------------------------------------------------------------------------------------------------------------
// Testing getJoin on a nonexistent instance.
//
// @module orderby_test.js
// ---------------------------------------------------------------------------------------------------------------------

var util = require('util');

var thinky = require('thinky')({ db: 'getjoin_test' });
var r = thinky.r;

// ---------------------------------------------------------------------------------------------------------------------

var Commit = thinky.createModel('Commit', {
    message: String,
    committed: { _type: Date, default: r.now() }
});

var Revision = thinky.createModel('Revision', {
    title: String,
    body: String,
    tags: [String],
    commit_id: String
});

Revision.belongsTo(Commit, "commit", "commit_id", "id");

// ---------------------------------------------------------------------------------------------------------------------

// Clear database
Commit.delete().run()
    .then(function()
    {
        return Revision.delete().run();
    })
    .then(function()
    {
        // Populate some commits
        var commit1 = new Commit({ message: "commit 1", committed: new Date(2013, 0, 1, 10, 12) });

        return commit1.save()
            .then(function()
            {
                // Populate some revisions
                var rev1 = new Revision({ title: "Test Page", body: "Test body 1.", tags: ['test'], commit_id: commit1.id });

                return rev1.save();
            });

    })

    // Illustrate the issue
    .then(function()
    {
        console.log('Should return DocumentNotFound error):\n');

        return Revision.get('not found').getJoin().run().then(function(revision)
        {
            console.log(util.inspect(revision, { colors: true }));
            return revision;
        }).catch(thinky.Errors.DocumentNotFound, function(error)
        {
            console.log('Document not found!');
        }).error(function(error)
        {
            console.log('Error:', util.inspect(error, { colors: true }));
        });
    })

    // Exit
    .then(function()
    {
        process.exit();
    });

// ---------------------------------------------------------------------------------------------------------------------
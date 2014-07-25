//----------------------------------------------------------------------------------------------------------------------
// Database models for Tome.
//
// @module models.js
//----------------------------------------------------------------------------------------------------------------------

var thinky = require('thinky');

var config = require('./config');

//----------------------------------------------------------------------------------------------------------------------

thinky = thinky({ db: 'tome_' + config.databaseSuffix, host: config.databaseHost, port: config.databasePort });

var r = thinky.r;
var db = { r: r, Errors: thinky.Errors };

//----------------------------------------------------------------------------------------------------------------------
// Users
//----------------------------------------------------------------------------------------------------------------------

db.User = thinky.createModel('User', {
    display: String,
    email: String,
    created: { _type: Date, default: r.now() }
}, { pk: 'email' });

//----------------------------------------------------------------------------------------------------------------------
// Pages
//----------------------------------------------------------------------------------------------------------------------

db.Page = thinky.createModel('Page', {
    created: { _type: Date, default: r.now() }
});

//----------------------------------------------------------------------------------------------------------------------
// Commits
//----------------------------------------------------------------------------------------------------------------------

db.Commit = thinky.createModel('Commit', {
    user_id: String,
    message: { _type: String, default: (config.defaultCommit || "minor edit") },
    committed: { _type: Date, default: r.now() }
});

// Relationships
db.Commit.belongsTo(db.User, "user", "user_id", "email");

//----------------------------------------------------------------------------------------------------------------------
// Revisions
//----------------------------------------------------------------------------------------------------------------------

db.Revision = thinky.createModel('Revision', {
    page_id: String,
    slug_id: String,
    title: String,
    tags: [String],
    body: String,
    commit_id: String,
    deleted: { _type: Boolean, default: false }
});

// Relationships
db.Revision.belongsTo(db.Commit, "commit", "commit_id", "id");
db.Commit.hasMany(db.Revision, "revisions", "id", "commit_id");
db.Revision.belongsTo(db.Page, "page", "page_id", "id");

//----------------------------------------------------------------------------------------------------------------------
// Slugs
//----------------------------------------------------------------------------------------------------------------------

db.Slug = thinky.createModel('Slug', {
    url: String,
    page: String,
    currentRevision_id: String
}, { pk: 'url' });

// Relationships
db.Slug.belongsTo(db.Revision, "currentRevision", "currentRevision_id", "id");
db.Revision.belongsTo(db.Slug, "slug", "slug_id", "url");

//----------------------------------------------------------------------------------------------------------------------
// Comments
//----------------------------------------------------------------------------------------------------------------------

db.Comment = thinky.createModel('Comment', {
    page_id: String,
    user_id: String,
    title: String,
    body: String,
    created: { _type: Date, default: r.now() },
    updated: { _type: Date, default: r.now() },
    resolved: { _type: Boolean, default: false }
});

// Relationships
db.Comment.belongsTo(db.Page, "page", "page_id", "id");
db.Comment.belongsTo(db.User, "user", "user_id", "email");

//----------------------------------------------------------------------------------------------------------------------

module.exports = db;

//----------------------------------------------------------------------------------------------------------------------
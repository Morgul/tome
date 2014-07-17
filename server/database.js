//----------------------------------------------------------------------------------------------------------------------
// API that wraps up working with our ORM.
//
// @module database.js
//----------------------------------------------------------------------------------------------------------------------

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

var pages = {
    get: function(slug)
    {
        return db.Slug.get(slug).getJoin().run();
    },

    getHistory: function(slug)
    {

    },

    create: function(slug)
    {

    },

    update: function(slug)
    {

    },

    delete: function(slug)
    {

    },

    move: function(slug)
    {

    },

    recentActivity: function(slug)
    {

    }
}; // end pages

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    users: users,
    pages: pages,
    Errors: db.Errors
}; // end exports

//----------------------------------------------------------------------------------------------------------------------
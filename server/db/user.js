//----------------------------------------------------------------------------------------------------------------------
// Brief description for user.js module.
//
// @module user.js
//----------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');

var db = require('../models');

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    get: function(id)
    {
        return db.User.get(id);
    },

    getRevisions: function(id)
    {
        return db.Revision.filter({ userID: id });
    },

    store: function(id, data)
    {
        return db.User.get(id)
            .catch(db.errors.DocumentNotFound, function()
            {
                return new db.User();
            })
            .then(function(user)
            {
                _.assign(user, data);
                return user.save();
            });
    }
}; // end exports

//----------------------------------------------------------------------------------------------------------------------
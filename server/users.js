//----------------------------------------------------------------------------------------------------------------------
// A simple API for working with users.
//
// @module users.js
//----------------------------------------------------------------------------------------------------------------------

var path = require('path');

var Promise = require("bluebird");
var jbase = require('jbase');

//----------------------------------------------------------------------------------------------------------------------

function UserDB()
{
    this.db = jbase.db('users', { rootPath: './server/db' });
} // end UserDB

UserDB.prototype.get = function(email, callback)
{
    return Promise.resolve(this.db.get(email)).nodeify(callback);
}; // end get

UserDB.prototype.store = function(user, callback)
{
    return Promise.resolve(this.db.store(user.email, user)).nodeify(callback);
}; // end store

UserDB.prototype.merge = function(user, callback)
{
    return Promise.resolve(this.db.merge(user.email, user)).nodeify(callback);
}; // end merge

//----------------------------------------------------------------------------------------------------------------------

module.exports = new UserDB();

//----------------------------------------------------------------------------------------------------------------------
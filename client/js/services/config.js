// ---------------------------------------------------------------------------------------------------------------------
// A service for retrieving/working with wiki configs.
//
// @module config.js
// ---------------------------------------------------------------------------------------------------------------------

function ConfigService($http)
{
    this.$http = $http;
    this.config = {};
    this._getConfig();
} // end ConfigService

ConfigService.prototype._getConfig = function()
{
    var self = this;
    this.$http.get('/api/config').then(function(success)
    {
        self.config = success.data;
    });
};

ConfigService.prototype.refresh = function()
{
    this._getConfig();
};

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.services').service('WikiConfig', ['$http', ConfigService]);

// ---------------------------------------------------------------------------------------------------------------------
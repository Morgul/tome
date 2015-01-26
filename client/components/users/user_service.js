// ---------------------------------------------------------------------------------------------------------------------
// UserService
//
// @module user_service.js
// ---------------------------------------------------------------------------------------------------------------------

function UserServiceFactory($resource, $http, $cacheFactory, _)
{
    var User = $resource('/users/:email', {}, {
        get: {
            transformResponse: function(data)
            {
                data = angular.fromJson(data);
                data.created = new Date(data.created);
                return data;
            }
        }
    });
    function UserService()
    {
        this.userCache = $cacheFactory('userCache', { capacity: 5 });
    } // end UserService

    UserService.prototype.get = function(email)
    {
        var user = this.userCache.get(email);

        if(!user)
        {
            user = User.get({ email: email });
            this.userCache.put(email, user);
        } // end if

        return user;
    }; // end get

    UserService.prototype.getDisplay = function(email)
    {
        var user = this.get(email);
        return user.nickname || user.displayName || user.email || email;
    }; // end getDisplay

    UserService.prototype.getRevisions = function(email, limit)
    {
        var revisions = [];

        $http.get('/users/' + email, { params: { recent: true, limit: limit } })
            .success(function(revs)
            {
                _.each(revs, function(revision)
                {
                    revision.created = new Date(revision.created);
                    revisions.push(revision);
                });
            });

        return revisions;
    }; // end getRevisions

    return new UserService();
} // end UserServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.services').service('UserService', [
    '$resource',
    '$http',
    '$cacheFactory',
    'lodash',
    UserServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------
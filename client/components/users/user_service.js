// ---------------------------------------------------------------------------------------------------------------------
// UserService
//
// @module user_service.js
// ---------------------------------------------------------------------------------------------------------------------

function UserServiceFactory($resource, $cacheFactory)
{
    var User = $resource('/users/:email');
    function UserService()
    {
        this.userCache = $cacheFactory('userCache', { capacity: 5 });
    } // end UserService

    UserService.prototype.get = function(email)
    {
        var user = this.userCache.get(email);

        if(!user)
        {
            console.log('user not found!');
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

    return new UserService();
} // end UserServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.services').service('UserService', [
    '$resource',
    '$cacheFactory',
    UserServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------
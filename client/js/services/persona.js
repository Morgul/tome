// ---------------------------------------------------------------------------------------------------------------------
// A service for retrieving/working with wiki pages.
//
// @module wikipage.js
// ---------------------------------------------------------------------------------------------------------------------

function PersonaService($route, $window, $http)
{
    var self = this;

    this.currentUser = $window.currentUser;
    this.loginUrl = "/auth/login-persona";
    this.logoutUrl = "/auth/logout-persona";

    navigator.id.watch({
        loggedInUser: this.currentUser,
        onlogin: function(assertion)
        {
            $http.post(self.loginUrl, { assertion: assertion })
                .success(function(data)
                {
                    self.currentUser = data;
                    $route.reload();
                })
                .error(function(data, status)
                {
                    console.error('login fail', data, status);
                    navigator.id.logout();
                });
        },
        onlogout: function()
        {
            $http.post(self.logoutUrl)
                .success(function()
                {
                    navigator.id.logout();
                    self.currentUser = null;
                    // This is commented out to avoid an infinite loop of
                    // reloads that could occur.
                    // TODO redict user to home screen on logout.
                    $route.reload();
                })
                .error(function(data, status)
                {
                    console.error('logout fail', data, status);
                });
        }
    });
} // end PersonaService


PersonaService.prototype.login = function()
{
    navigator.id.request();
};

PersonaService.prototype.logout = function()
{
    navigator.id.logout();
};

PersonaService.prototype.getUser = function(){
    return this.currentUser;
};

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.services').service('Persona', ['$route', '$window', '$http', PersonaService]);

// ---------------------------------------------------------------------------------------------------------------------


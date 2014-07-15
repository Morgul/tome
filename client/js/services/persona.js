// ---------------------------------------------------------------------------------------------------------------------
// A service for retrieving/working with wiki pages.
//
// @module wikipage.js
// ---------------------------------------------------------------------------------------------------------------------

function PersonaService($location, $route, $window, $http)
{
    var self = this;

    this.currentUser = $window.currentUser;
    this.loginUrl = "/auth/login-persona";
    this.logoutUrl = "/auth/logout-persona";
    this.registrationUrl = "/registration";

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
                    // We always call logout, that way, nothing thinks we're logged in again.
                    navigator.id.logout();

                    if(status == 403)
                    {
                        $location.path(self.registrationUrl);

                        if(data.email)
                        {
                            $location.search('email=' + data.email);
                        } // end if
                    }
                    else
                    {
                        console.error('login failed:', data, status);
                    } // end if
                });
        },
        onlogout: function()
        {
            $http.post(self.logoutUrl)
                .success(function()
                {
                    navigator.id.logout();
                    self.currentUser = null;

                    $route.reload();
                    //$location.path('/').search("");
                })
                .error(function(data, status)
                {
                    console.error('logout failed:', data, status);
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

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.services').service('Persona', ['$location', '$route', '$window', '$http', PersonaService]);

// ---------------------------------------------------------------------------------------------------------------------


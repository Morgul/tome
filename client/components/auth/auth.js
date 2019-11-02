// ---------------------------------------------------------------------------------------------------------------------
// AuthService
//
// @module auth.js
// ---------------------------------------------------------------------------------------------------------------------

function AuthServiceFactory($rootScope, $http, Promise)
{
    function AuthService()
    {
        this.initDeferred = Promise.defer();
        this._user = undefined;

        // We have to expose this to window for Google to pick it up.
        window.onGoogleInit = this._onGoogleInit.bind(this);
        window.onGoogleSignIn = this._onGoogleSignIn.bind(this);
        window.onGoogleFailure = this._onGoogleFailure.bind(this);
    } // end AuthService

    AuthService.prototype = {
        get authorized() { return !!this._user; },
        get user() { return this._user; },
        set user(val)
        {
            if(val)
            {
                Object.defineProperty(val, 'display', {
                    get: function(){ return this.nickname || this.displayName || this.email; }
                });
            } // end if

            this._user = val;
        },
        get initialized(){ return this.initDeferred.promise; }
    }; // end signOut

    AuthService.prototype._onGoogleInit = function()
    {
        window.gapi.load('auth2', () =>
        {
            window.gapi.auth2.init();
            this.auth2 = gapi.auth2.getAuthInstance();

            // We listen for the current user to change
            this.auth2.currentUser.listen((googleUser) =>
            {
                if(googleUser.isSignedIn())
                {
                    this._onGoogleSignIn(googleUser);
                }
                else
                {
                    this._user = undefined;
                } // end if
            });
        });
    }; // end _onGoogleInit

    AuthService.prototype._onGoogleSignIn = function(googleUser)
    {
        return this.$completeSignIn(googleUser.getAuthResponse().id_token);
    }; // end _onGoogleSignIn

    AuthService.prototype._onGoogleFailure = function(error)
    {
        console.warn('Google Sign In failure:', error);
    }; // end _onGoogleFailure

    AuthService.prototype.$completeSignIn = function(idToken)
    {
        return $http.post('/auth/google', { idToken })
            .success((data) =>
            {
                this._user = data;
            })
            .error((error) =>
            {
                console.error('Failed to complete sign in:', error);
            });
    }; // end $completeSignIn

    AuthService.prototype.signOut = function()
    {
        $http.post('/auth/logout')
            .success(() =>
            {
                // Sign the user out
                window.gapi.auth.signOut();
            });
    }; // end signOut

    return new AuthService();
} // end AuthServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.services').service('AuthService', [
    '$rootScope',
    '$http',
    '$q',
    AuthServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------

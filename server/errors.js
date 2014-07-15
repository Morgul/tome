//----------------------------------------------------------------------------------------------------------------------
// Brief description for errors module.
//
// @module errors
//----------------------------------------------------------------------------------------------------------------------

function NotImplementedError(message) {
    this.name = "NotImplementedError";
    this.message = (message || "");
}
NotImplementedError.prototype = Error.prototype;

function RegistrationRequiredError(message) {
    this.name = "RegistrationRequiredError";
    this.message = (message || "User not found; registration is required.");
}
RegistrationRequiredError.prototype = Error.prototype;

function NotAuthorizedError(message) {
    this.name = "NotAuthorizedError";
    this.message = (message || "User is not authorized.");
}
NotAuthorizedError.prototype = Error.prototype;

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    NotImplementedError: NotImplementedError,
    RegistrationRequiredError: RegistrationRequiredError,
    NotAuthorizedError: NotAuthorizedError
}; // end exports

//----------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// Configuration for the Tome Wiki.
//
// @module config.js
// ---------------------------------------------------------------------------------------------------------------------

module.exports = {

    // -----------------------------------------------------------------------------------------------------------------
    // General
    // -----------------------------------------------------------------------------------------------------------------

    // The port to run on
    port: 4000,

    // The wiki page you want your base URL to redirect to
    frontPage: '/welcome',

    // The default message inserted when making a change
    defaultCommit: "minor edit",

    // -----------------------------------------------------------------------------------------------------------------
    // Customization
    // -----------------------------------------------------------------------------------------------------------------

    // Name of your wiki
    name: 'Initial Tome Wiki',

    // URL to the logo for your wiki
    logo: '/images/tome.png',

    // Description for your wiki
    description: 'This is the initial (for testing) Tome Wiki',

    // Changes the theme to any theme available from http://bootswatch.com/. Example values are:
    // "Flatly", "Cyborg", "Readable", "Spacelab", "United", etc.
    bootSwatchTheme: "Flatly",

    // Template to include at the bottom of the body block; useful for adding in your own css file, etc.
    extraTemplate: "",

    // Any text you wish to display in the footer of every page, i.e. copyright, etc.
    footerText: "Copyright 2014 Christopher Case. All rights reserved.",

    // -----------------------------------------------------------------------------------------------------------------
    // Authentication
    // -----------------------------------------------------------------------------------------------------------------

    // The prefix used for secure cookies.
    sid: 'tome',

    // Replace this with any random string. This is used for your secure cookies.
    secret: '72156a61342a86841047426761d94687b74434cf',

    // The application's client id and secret from Google.
    googleClientID: '353888173268-4luhg23ai0i6rskck2pjcs4bdssnhshk.apps.googleusercontent.com',
    googleSecret: 'ZsjeJtlyB2H3XxUvD4V2JW4Q',

    // Supports `true` for automatically creating users, or `false` to disable new user creation.
    autoCreateUsers: true

    // -----------------------------------------------------------------------------------------------------------------

};

// ---------------------------------------------------------------------------------------------------------------------
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

    // The database will be `tome_` plus this string.
    databaseSuffix: 'testing',

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
    // "Default", "Flatly", "Cyborg", "Readable", "Spacelab", "United", etc.
    bootSwatchTheme: "Flatly",

    // Template to include at the bottom of the body block; useful for adding in your own css file, etc.
    extraTemplate: "",

    // Any text you wish to display in the footer of every page, i.e. copyright, etc.
    footerText: "Copyright 2014 Christopher Case. All rights reserved.",

    // -----------------------------------------------------------------------------------------------------------------
    // Authentication
    // -----------------------------------------------------------------------------------------------------------------

    // The url to use for persona authentication
    audience: "http://cypher:4000",

    // The prefix used for secure cookies.
    sid: 'tome',

    // Replace this with any random string. This is used for your secure cookies.
    secret: '72156a61342a86841047426761d94687b74434cf',

    // Try to choose questions that don't have easily google-able answers. If you have more than one question, we will
    // randomly rotate them.
    //
    // Takes an array of objects in the format of:
    // {
    //     question: String,
    //     answer: String,
    //     hint: String,    // Optional
    // }
    humanVerificationQuestions: [
        {
            question: "What is the common name for the large grey orb in the night's sky?",
            answer: "moon",
            hint: "Lowercase."
        },
        {
            question: "What type of animals say 'CAN HAZ CHEESBURGER'?",
            answer: "lolcats",
            hint: "Plural, starts with 'lol'."
        }
    ],

    // Supports `"auto"` for automatically creating users, `true` to enable registration, or `false` to disable new user
    // creation.
    registration: true//"auto"

    // -----------------------------------------------------------------------------------------------------------------

};

// ---------------------------------------------------------------------------------------------------------------------
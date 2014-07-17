// ---------------------------------------------------------------------------------------------------------------------
// Configuration for the Tome Wiki.
//
// @module config.js
// ---------------------------------------------------------------------------------------------------------------------

module.exports = {

    // -----------------------------------------------------------------------------------------------------------------
    // General
    // -----------------------------------------------------------------------------------------------------------------

    // The wiki page you want your base URL to redirect to
    frontPage: '/welcome',

    // Name of your wiki
    name: 'Initial Tome Wiki',

    // URL to the logo for your wiki
    logo: '/images/tome.png',

    // Description for your wiki
    description: 'This is the initial (for testing) Tome Wiki',

    // The database will be `tome_` plus this string.
    databaseSuffix: 'testing',

    // The default message inserted when making a change
    defaultCommit: "minor edit",

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
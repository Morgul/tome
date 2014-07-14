// ---------------------------------------------------------------------------------------------------------------------
// Configuration for the Tome Wiki.
//
// @module config.js
// ---------------------------------------------------------------------------------------------------------------------

module.exports = {

    // -----------------------------------------------------------------------------------------------------------------
    // Authentication
    // -----------------------------------------------------------------------------------------------------------------

    // The url to use for persona authentication
    audience: "http://localhost:4000",

    // The prefix used for secure cookies.
    sid: 'tome',

    // Replace this with any random string. This is used for your secure cookies.
    secret: '72156a61342a86841047426761d94687b74434cf',

    // Allow new users to register
    allowRegistration: true,

    // Try to choose questions that don't have easily google-able answers
    humanVerificationQuestions: [
        {
            question: "What is the common name for the large grey orb in the night's sky?",
            answer: "moon"
        },
        {
            question: "What type of animals say 'CAN HAZ CHEESBURGER'?",
            answer: "lolcats"
        }
    ]

    // -----------------------------------------------------------------------------------------------------------------

};

// ---------------------------------------------------------------------------------------------------------------------
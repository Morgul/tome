# Tome Wiki

Tome is an attempt to create a wiki that is slim, trivial to deploy, looks clean, and is written as a modern
web application. It's core features are:

* Built in search
* Revision history
* Ability to diff page revisions
* 3-way merge resolution
* Syntax-highlighted editor
* Markdown syntax
* Mobile support
* Persona-backed user system
* Blog style Comments on pages
* Logo/Name/CSS customization
* (_New_) Anchor Tag support

## Current Status

Right now I'm closing in on my first preview release.

The following items are left:

* 3-way merge resolution

## Installing

To get going with tome, you will need to either make a new node project, or at the very least, make a new directory. 
Tome is installed as an npm package, and requires a couple of lines of code from you to get running. (This is so that 
we can  allow you to easily customize it, without needing to edit any of the core files.)

Assuming you've made a directory called `example-wiki`, you should do the following:

```bash
$ cd example-wiki
$ npm install tome
```

This will install the latest version of Tome into the `example-wiki` directory.

### Setup

Now, the bare minimum you need is a file to launch the Tome wiki:

```javascript
var tome = require('tome');

tome.listen();
```

That's it! Now, you should have a tome instance running on http://localhost:4000. 

## Customizing

In order to customize Tome, you will want to add a configuration file. I recommend copying the `config.example.js` file 
from the main repository, and modifying that. It has some nice explanations about what the configuration options do,
and how to use them. (Still, some of the information is replicated here, to make it easier to find.)

### Serving static files

Tome uses [connect](https://github.com/senchalabs/connect#readme) as it's middleware. This means that it should be 
trivial for you to use connect to serve static files. ( _Note: Tome uses connect 0.2.X at the moment._ ) If you want to
do so, you can do the following:

```javascript
var connect = require('connect');
var tome = require('tome');

// Serve our local static directory
tome.app.use(connect.static('static'));

// Start the server
tome.listen();
```

This will serve the contents of the `static` directory at the root of your website.

### Custom Logo

You can customize the logo used for Tome. Simple set the `logo` config option to any valid url, and it will load that 
logo in the navbar, as well as use it for the favicon. ( _Note: The logo will be forced to 50px high. If you want this 
to look good on high dpi screens, I recommend using a logo that is 100px high. Width is less important, but if you make 
it too wide, it could cause issues with flow in the navbar._ )

### Custom CSS

While Tome doesn't support custom CSS directly, it does support an 'extra template' that is included at the bottom of 
the `<body>` tag in the index page. This means that in you config file, you can do:

```javascript
...

extraTemplate: "/partials/custom_css.html"

...
```

Then, you will have to serve some static directory, and inside of it place a `partials` folder with a `custom_css.html`
file inside of it. Here is an example of such a template:

```html
<link href="http://fonts.googleapis.com/css?family=Electrolize" rel="stylesheet" type="text/css">
<link href="/css/dice.css" rel="stylesheet">
<link href="/css/powers.css" rel="stylesheet">
```

## Testing

TBD.

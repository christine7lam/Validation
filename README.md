## Setup

### Prerequisite

* You must have Node.js and npm installed
* You must have git installed
* You must have Redis installed
* If you are on Windows you must restart your computer after you install Node.js

***

### Build (Client)

To build this project you must first clone the `tycoon` repository:

> `git clone http://username@stash.infra.gotyco.net/scm/tnweb/tycoon-ui.git`

Next, change directory to the root of the project and download dependencies with NPM:

> `npm install`

It is recommended that you install the gulp client globally:

> `npm install -g gulp-cli`

Now you can build the project:

> `gulp build`

This will create a build directory with a document root file (index.html) as well as the associated JavaScript and CSS files; this process will also set up a watch on your files and rebuild the appropriate parts of your project when changes occur.

**This process should continue to run while you are developing, you should run it with `forever` or open a new terminal or command prompt and execute the next step.**

***

### Run (Server)

To run this project, you should use `npm` with the scripts defined in `package.json`:

> `npm start`

You can now navigate to [localhost on port 3000](http://localhost:3000) to view the running web interface.

***

### Run Defaults

The UI uses the following defaults:

* environment: development
* port: 3000

To override the defaults you should set the following environmental variables in accordance with your platform:

* NODE_ENV
* PORT

***

### Run Forever

To run the UI as a more permanent process, you should install the `forever` npm package and issue the following command:

> `NODE_ENV=test PORT=80 forever start -c "npm start" /path/to/tycoon-ui`

Please note that the default environment and port variables have been overridden here.
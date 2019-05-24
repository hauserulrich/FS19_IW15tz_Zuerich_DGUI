# Travis actions
Travis is the test engine running automatically on each GitHub commit.
The configuration is given in `./.travis.yml` (relative to the project home).

##How to run the CI activities locally

### Environment
Local testing can be performed, if nodejs and npm is installed locally.
It is console based as the travis machine tests console based as well.
A console must be opened in the root directory of the project.
The environment can be installed using `npm install`.

### Running tests locally

#### HTMLLINT
*htmllint* is run using `./node_modules/.bin/htmllint ./www/**/*.html`.
The configuration is given in `./.htmllintrc` (relative to the project home).

#### CSSLINT
*csslint* is run using `./node_modules/.bin/stylelint ./www/**/*.css`.
The comnfiguration is given in `./.stylelintrc`  (relative to the project home).

#### JS lint
*js linting* is run using `./node_modules/.bin/eslint ./www/**/*.js` and `./node_modules/.bin/eslint ./www/**/*.js`.
The comnfiguration is given in `./.eslintrc.json`  (relative to the project home).

#### JavaScript Unit Tests
JavaScript unit tests can be run using `npm test`.
In fact *jest* is run in the background.
It will take the test scripts defined in `./tests` (relative to the project home) and run them, testing the JavaScript code found in `./www/` (relative to the project home).

### Creating technical documentation for JavaScript code

#### Running the generator engine
The generator (*jsdoc*) can be run using `./node_modules/.bin/jsdoc -d ./jsdoc ./www/**/*.js`.
It generates documentation in `./jsdoc`, (relative to the project home).


# grunt-boilerplate
> A Grunt Boilerplate for Front-end Themes

## Description
This a Grunt Boilerplate was builder from Front-end Themes

## Requires to use Grunt Tasks
* [Node.JS](http://nodejs.org/) - Last Stable Version
* [Grunt]
    *  npm install -g grunt
* [Ruby 2.0 +] (http://rubyinstaller.org/downloads/)
    * http://rubyinstaller.org/downloads/
* [SCSS-lint] (https://github.com/brigade/scss-lint)
  * https://github.com/brigade/scss-lint
  * gem install scss_lint
* [jsHint] (http://jshint.com/install/)
  * http://jshint.com/install/
  * npm install -g jshint
* [Cucumber] (https://github.com/cucumber/cucumber-js)
  * https://github.com/cucumber/cucumber-js
  * npm install -g cucumber


#### 1) It's necessary to install Grunt Globally
``` bash
npm uninstall -g grunt
```
#### 2) Run npm install
``` bash
npm i or npm install
```
#### 3) After to check if its installed please run
``` bash
   grunt -v
   grunt
```

## Grunt Tasks Description
 ##### **Styles**
  * compilate scss to css
  * globbing scss files
  * add Normalize
  * include breakpoint sass
  * validate scss
  - mimify the css

 ##### **Sprites**
  * generate sprite from *.png files inserted on src/images/sprites to dist/images
  * generate css on src/styles
  * generate Retina Version
  * if you want to create the Retina version, its necessary to create the same icon with the double size and a suffix "@2x.png"

 ##### **Scripts**
  * compile js files to one (or not)
  * validate using jshint
  - uglify

 ##### **Browser Sync / Server**

 ##### **HTML Render - JSP**
  *

 ##### **Default Task / Watch**
  * Watch scss
  * Watch JS
  * Watch images
  * Watch fonts
  * Watch Sprites

 ##### **Cucumber**
 * automatizated tests using cucumber

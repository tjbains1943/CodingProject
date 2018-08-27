const path = require('path');
const HtmlReporter = require('jasmine-pretty-html-reporter').Reporter;

jasmine.getEnv().addReporter(
  new HtmlReporter({
    path: path.join(__dirname, '..', '..', 'reports')
  })
);

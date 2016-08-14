var Browser = require('zombie');
var assert = require('chai').assert;
var browser;

suite('Cross-Page Tests', function(){

  var requesting = 'requesting a group rate page from ';
  var expectedOutcome = 'populate the refferer field';

  setup(function() {
    browser = new Browser();
  })

  test(requesting + 'hood-river tour page should ' + expectedOutcome, function(done){
    var refferer = 'http://localhost:3000/tours/hood-river';
    browser.visit(refferer, function() {
      browser.clickLink('.requestGroupRate', function () {
        assert(browser.field('refferer').value === refferer);
      })
    })
    done();
  });

  test(requesting + "Oregon Coast page should " + expectedOutcome, function(done){
    var refferer = 'http://localhost:3000/tours/oregon-coast';
    browser.visit(refferer, function() {
      browser.clickLink('.requestGroupRate', function() {
        assert(browser.field('refferer').value === refferer);
      })
    })
    done();
  });

  test('visiting the group rate page directly should ' + 'result in the refferer field being empty', function(done){
    browser.visit('http://localhost:3000/tours/request-group-rate', function() {
      assert(browser.field('refferer').value === '');
    });
    done();
  });

});

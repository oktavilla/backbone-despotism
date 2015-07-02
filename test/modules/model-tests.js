"use strict";
var assert = require("assert");
var Backbone = require("backbone");
var BackboneDespotism = require("../../backbone-despotism.js");

describe("Backbone Despotism", function() {
  it("Ignores undefined properties", function() {
    var MyStrictModel = Backbone.StrictModel.extend({
      props: {
        "first": Backbone.StrictModel.type.STRING,
        "last": Backbone.StrictModel.type.STRING
      }
    });

    var myStrictModelInstance = new MyStrictModel();
    myStrictModelInstance.set("monkey", "banana"); // Should be ignored
    myStrictModelInstance.set({
      "first": "Gustaf",
      "last": "Forsslund",
      "animal": "monkey"
    });

    assert.deepEqual(myStrictModelInstance.attributes, {
      "first": "Gustaf",
      "last": "Forsslund"
    }, "Does not ignore undefined properties");

  });
});







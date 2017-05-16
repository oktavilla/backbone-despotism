"use strict";
var assert = require("assert");
var Backbone = require("backbone");
var BackboneDespotism = require("../../backbone-despotism.js");

describe("Backbone Despotism", function() {
  // Testing undefined properties
  it("Ignores undefined properties", function() {
    var MyStrictModel = Backbone.StrictModel.extend({
      props: {
        firstName: Backbone.StrictModel.type.STRING,
        lastName: Backbone.StrictModel.type.STRING
      }
    });

    var model = new MyStrictModel();
    model.set("fruit", "banana"); // Should be ignored
    model.set({
      firstName: "Bill",
      lastName: "Drummond",
      animal: "monkey"
    });

    assert.deepEqual(model.attributes, {
      firstName: "Bill",
      lastName: "Drummond"
    }, "Does not ignore undefined properties");
  });

  // Testing foreign keys
  it("Uses foreign keys", function() {
    var MyStrictModel = Backbone.StrictModel.extend({
      props: {
        firstName: Backbone.StrictModel.type.STRING,
        lastName: {
          type: Backbone.StrictModel.type.STRING,
          foreignKey: "surname"
        }
      }
    });
    var model = new MyStrictModel();
    model.set({
      firstName: "James",
      lastName: "Cauty"
    }, { useForeignKeys: true });
    assert.deepEqual(model.attributes, {
      firstName: "James",
      lastName: "Cauty"
    }, "Uses key");
    model.clear();
    model.set({
      firstName: "James",
      surname: "Cauty"
    }, { useForeignKeys: true });
    assert.deepEqual(model.attributes, {
      firstName: "James",
      lastName: "Cauty"
    }, "Uses foreign key");
    model.clear();
    model.set({
      firstName: "James",
      lastName: "Cauty",
      surname: "Drummond"
    }, { useForeignKeys: true });
    assert.deepEqual(model.attributes, {
      firstName: "James",
      lastName: "Cauty"
    }, "Prefers key to foreign key");
  });

  // Testing defaults
  it("Uses default values", function() {
    var MyStrictModel = Backbone.StrictModel.extend({
      props: {
        firstName: Backbone.StrictModel.type.STRING,
        lastName: Backbone.StrictModel.type.STRING
      },
      defaults: {
        firstName: "James"
      }
    });
    var model = new MyStrictModel();
    model.set("lastName", "Cauty");
    assert.deepEqual(model.attributes, {
      firstName: "James",
      lastName: "Cauty"
    }, "Uses default values");
    model.clear();
    model.set({
      firstName: "Bill",
      lastName: "Drummond"
    });
    assert.deepEqual(model.attributes, {
      firstName: "Bill",
      lastName: "Drummond"
    }, "Ignores default value if value exists");
  });

  // Testing defaults with foreign keys
  it("Uses foreign keys with default values", function() {
    var MyStrictModel = Backbone.StrictModel.extend({
      props: {
        firstName: Backbone.StrictModel.type.STRING,
        lastName: {
          type: Backbone.StrictModel.type.STRING,
          foreignKey: "surname"
        }
      },
      defaults: {
        lastName: "Drummond"
      }
    });
    var model = new MyStrictModel();
    model.set({
      firstName: "James",
      lastName: "Cauty"
    }, { useForeignKeys: true });
    assert.deepEqual(model.attributes, {
      firstName: "James",
      lastName: "Cauty"
    }, "Uses key");
    model.clear();
    model.set({
      firstName: "James",
      surname: "Cauty"
    }, { useForeignKeys: true });
    assert.deepEqual(model.attributes, {
      firstName: "James",
      lastName: "Cauty"
    }, "Uses foreign key");
    model.clear();
    model.set({
      firstName: "James",
      lastName: "Cauty",
      surname: "Timelord"
    }, { useForeignKeys: true });
    assert.deepEqual(model.attributes, {
      firstName: "James",
      lastName: "Cauty"
    }, "Prefers key to foreign key");
    model.clear();
    model.set({
      firstName: "James",
      surname: "Cauty"
    }, { useForeignKeys: true });
    assert.deepEqual(model.attributes, {
      firstName: "James",
      lastName: "Cauty"
    }, "Prefers foreign key to default");
  });
});

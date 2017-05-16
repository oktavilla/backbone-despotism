/**
* Strict model
*  You can have property definitions on a model like so:
*
*  props: {
*    "name": Backbone.StrictModel.type.STRING,
*    "count": {
*      "type": Backbone.StrictModel.type.NUMBER
*    }
*  }
*
*  Properties will only be `set` on the model if they exist in the props
*  definition and match the type. All other properties will simply be ignored.
*
*  You can also define data mappings. This is useful for transforming
*  a model into another type of model.
*
*  Example:
*  props: {
*    "name": {
*      "type": Backbone.StrictModel.type.STRING,
*      "foreignKey": "firstName"
*    }
*  }
*
*  In the example above, doing `new MyStrictModel({ firstName: "Göran" }, { useForeignKeys: true })` will result in a model
*  with `{ "name": "Göran" }`.
*/
(function(root, factory) {
  "use strict";
  // First AMD.
  if (typeof define === "function" && define.amd) {
    define(["exports", "backbone", "underscore"], factory);
  }
  // Next for Node.js or CommonJS.
  else if (typeof exports !== "undefined") {
    factory(exports, require("backbone"), require("underscore"));
  }
  // And as a browser global. Using `root` as it references `window`.
  else {
    factory(root, root.Backbone, root._);
  }
} (this, function(exports, Backbone, _) {
  Backbone.StrictModel = Backbone.Model.extend({
    set: function(key, value, options) {
      var attrs;
      if (key === null) {
        return this;
      }
      // Handle both `key, value` and `{ key: value }` style arguments.
      if (typeof key === "object") {
        attrs = key;
        options = value;
      } else {
        (attrs = {})[key] = value;
      }
      options = options || {};
      if (this.props && !options.unset) {
        attrs = mapAttributes(attrs, this.props, this.defaults, options);
      }
      return Backbone.Model.prototype.set.apply(this, [attrs, options]);
    },
  }, {
    type: {
      STRING: "string",
      NUMBER: "number",
      OBJECT: "object",
      BOOLEAN: "boolean"
    }
  });

  function mapAttributes (json, props, defaults, options) {
    var attributes;
    var foreignKeys;

    // Foreign keys should only be used if specifically requested
    if (options.useForeignKeys) {
      // Find candidates for foreign keys to use
      foreignKeys = _.reduce(props, function(result, definition, key) {
        var foreignKey;
        // Foreign key (if it exists) should only be used if the key does not
        // exist in the json or it has the default value
        foreignKey = (definition.foreignKey && (typeof json[key] === "undefined" || (defaults && json[key] === defaults[key] && typeof json[definition.foreignKey] !== "undefined"))) ? definition.foreignKey : undefined;
        if (foreignKey) {
          result[key] = foreignKey;
        }
        return result;
      }, {});
    }

    // Get attribute map
    attributes = _.reduce(props, function(result, definition, key) {
      var foreignKey = foreignKeys ? foreignKeys[key] || key : key;
      var type = definition.type || definition;
      // If the current key exists as a foreign key candidate, ignore it in the
      // source data (because we'll want to use the value for
      // the mapped property instead)
      if (foreignKeys && typeof json[key] !== "undefined" && key === foreignKey && json[key] && _.find(foreignKeys, function(x) { return x === key; })) {
        foreignKey = undefined;
      }
      // Check that this property exists in the json, and import it if so...
      if (foreignKey && json[foreignKey] !== undefined && typeof json[foreignKey] === type) {
        result[key] = json[foreignKey];
      }
      return result;
    }, {});

    return attributes;
  }
}));

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
*  In the example above, doing `new MyStrictModel({ firstName: "Göran" })` will result in a model
*  with `{ "name": "Göran" }`. However, when just setting properties, you will need to be
*  explicit about wanting to use the foreign mappings. For example, `myModelInstance.set({ firstName: "Sven" })`
*  will have no effect on the model instance, but
*  `myModelInstance.set({ firstName: "Sven" }, { useForeignKeys: true })` will.
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
    constructor: function(attributes, options) {
      // Make sure that the options object when initializing a new instance of
      // the StrictModel always has { initialize: true }
      attributes = attributes || (attributes = {});
      options || (options = {});
      options.initialize = true;
      return Backbone.Model.call(this, attributes, options);
    },

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
      if (this.props) {
        attrs = mapAttributes(attrs, this.props, this.defaults, options);
      }
      return Backbone.Model.prototype.set.apply(this, [attrs, options || {}]);
    },
    
    unset: function (key, options) {
      // Avoiding strict set method for unset
      return Backbone.Model.prototype.set.call(this, key, void 0, _.extend({}, options, { unset: true }));
    }
  }, {
    type: {
      STRING: "string",
      NUMBER: "number",
      OBJECT: "object",
      BOOLEAN: "boolean"
    }
  });
  
  function mapAttributes (json, props, defaults, options) {
    var self = this;
    var attributes = {};
    options || (options = {});
    _.each(props, function(definition, key) {
      var foreignKey = key;
      // Foreign keys should only be used on initialization of the model, or if
      // specifically requested
      if (options.useForeignKeys || options.initialize || options.reset) {
        // Foreign key (if it exists) should only be used if the key does not exist in the json or it has the default value
        foreignKey = (definition.foreignKey && (typeof json[key] === "undefined" || (defaults && json[key] === defaults[key] && typeof json[definition.foreignKey] !== "undefined"))) ? definition.foreignKey : key;
      }
      var type = definition.type || definition;
      // Check that this property exists in the json, and import it if so...
      if (json[foreignKey] !== undefined && typeof json[foreignKey] === type) {
        attributes[key] = json[foreignKey];
      }
    });
    return attributes;
  }
}));

# Backbone Despotism
A Backbone replacement model that enforces property declarations. 
Exposes a model called `Backbone.StrictModel`.

## Creating a model with a properties definition

```javascript
var MyStrictModel = Backbone.StrictModel.extend({
  props: {
    "name": Backbone.StrictModel.type.STRING,
    "count": {
      "type": Backbone.StrictModel.type.NUMBER
    }
  }
});

var myStrictModelInstance = new MyStrictModel();

myStrictModelInstance.set("monkey", "banana"); // Will be ignored
myStrictModelInstance.set("name", 43); // Will be ignored
myStrictModelInstance.set("count", 43); // Will be set
myStrictModelInstance.set({
  "name": "Gustaf",
  "count": 12,
  "animal": "monkey"
}); // Will set `name` and `count` but will ignore `type`
```

## Types

The available types is:
```javascript
Backbone.StrictModel.type.STRING
Backbone.StrictModel.type.NUMBER
Backbone.StrictModel.type.BOOLEAN
Backbone.StrictModel.type.OBJECT // Everything else like arrays and structs
```

## Using data mappings

You can use data mappings to rename properties on `model.set`.

Example:
```javascript
var MyStrictModel = Backbone.StrictModel.extend({
  props: {
    "name": {
      "type": Backbone.StrictModel.type.STRING,
      "foreignKey": "firstName"
    }
  }
});
```

In the example above, doing `set("firstName", "Göran")` will result in `{ "name": "Göran" }`
However, if you do `set({ "firstName": "Göran", "name": "Göran Smöran" })` firstName will be ignored and the data in `name` will be used instead.

module.exports = {
  'Backbone.Validation patterns': {
    beforeEach: function() {
      var that = this;
      this.valid = function(value) {
        assert(value.match(that.pattern), value + ' should be valid');
      };

      this.invalid = function(value) {
        refute(value.match(that.pattern), value + ' should be invalid');
      };
    },

    'email pattern matches all valid email addresses': function() {
      this.pattern = Validation.patterns.email;

      this.valid('name@example.com');
      this.valid('name@example.com');
      this.valid('name+@example.co');
      this.valid('n@e.co');
      this.valid('first.last@backbone.example.com');
      this.valid('(unsual)[very]@strange.example.com');
      this.valid('x@example.com');

      this.invalid('name');
      this.invalid('name@');
      this.invalid('name@example');
      this.invalid('name.@example.c');
      this.invalid('name,@example.c');
      this.invalid('name;@example.c');
      this.invalid('name@example.com.');
      this.invalid('Abc.example.com');
      this.invalid('a"b(c)d,e:f;g<h>i[jk]l@example.com');
      this.invalid('just"not"right@example.com');
    },

    'email pattern is case insensitive': function() {
      this.pattern = Validation.patterns.email;

      this.valid('NaMe@example.COM');
      this.valid('NAME@EXAMPLE.COM');
    },

    'url pattern matches all valid urls': function() {
      this.pattern = Validation.patterns.url;

      this.valid('http://thedersen.com');
      this.valid('http://www.thedersen.com/');
      this.valid('http://øya.no/');
      this.valid('http://öya.no/');
      this.valid('https://thedersen.com/');
      this.valid('http://thedersen.com/backbone.validation/?query=string');
      this.valid('ftp://thedersen.com');
      this.valid('http://127.0.0.1');

      this.invalid('thedersen.com');
      this.invalid('http://thedersen');
      this.invalid('http://thedersen.');
      this.invalid('http://thedersen,com');
      this.invalid('http://thedersen;com');
      this.invalid('http://.thedersen.com');
      this.invalid('http://127.0.0.1.');
    },

    'url pattern is case insensitive': function() {
      this.pattern = Validation.patterns.url;

      this.valid('http://Thedersen.com');
      this.valid('HTTP://THEDERSEN.COM');
    },

    'number pattern matches all numbers, including decimal numbers': function() {
      this.pattern = Validation.patterns.number;

      this.valid('123');
      this.valid('-123');
      this.valid('123,000');
      this.valid('-123,000');
      this.valid('123.45');
      this.valid('-123.45');
      this.valid('123,000.45');
      this.valid('-123,000.45');
      this.valid('123,000.00');
      this.valid('-123,000.00');
      this.valid('.10');
      this.valid('123.');

      this.invalid('abc');
      this.invalid('abc123');
      this.invalid('123abc');
      this.invalid('123.000,00');
      this.invalid('123.0.0,00');
    },

    'digits pattern matches single or multiple digits': function() {
      this.pattern = Validation.patterns.digits;

      this.valid('1');
      this.valid('123');

      this.invalid('a');
      this.invalid('a123');
      this.invalid('123a');
    }
  }
};

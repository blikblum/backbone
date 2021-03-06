module.exports = {
  'rangeLength validator': {
    beforeEach: function() {
      this.validation = {
        name: {
          rangeLength: [2, 4]
        }
      };

      @withValidation
      class Model extends Backbone.Model {
        set(...args) {
          super.set(...args);
          return this.validationError === null;
        }
      }
      Model.validation = this.validation;

      this.model = new Model();
    },

    'has default error message for strings': function(done) {
      this.model.on('validated', function(model, error) {
        assert.equals({ name: 'Name must be between 2 and 4 characters' }, error);
        done();
      });
      this.model.set({ name: 'a' }, { validate: true });
    },

    'string with length shorter than first value is invalid': function() {
      refute(
        this.model.set(
          {
            name: 'a'
          },
          { validate: true }
        )
      );
    },

    'string with length equal to first value is valid': function() {
      assert(
        this.model.set(
          {
            name: 'aa'
          },
          { validate: true }
        )
      );
    },

    'string with length longer than last value is invalid': function() {
      refute(
        this.model.set(
          {
            name: 'aaaaa'
          },
          { validate: true }
        )
      );
    },

    'string with length equal to last value is valid': function() {
      assert(
        this.model.set(
          {
            name: 'aaaa'
          },
          { validate: true }
        )
      );
    },

    'string with length within range is valid': function() {
      assert(
        this.model.set(
          {
            name: 'aaa'
          },
          { validate: true }
        )
      );
    },

    'spaces are treated as part of the string (no trimming)': function() {
      refute(
        this.model.set(
          {
            name: 'aaaa '
          },
          { validate: true }
        )
      );
    },

    'non strings are treated as an error': function() {
      refute(
        this.model.set(
          {
            name: 123
          },
          { validate: true }
        )
      );
    },

    'when required is not specified': {
      'undefined is invalid': function() {
        refute(
          this.model.set(
            {
              name: undefined
            },
            { validate: true }
          )
        );
      },

      'null is invalid': function() {
        refute(
          this.model.set(
            {
              name: null
            },
            { validate: true }
          )
        );
      }
    },

    'when required:false': {
      beforeEach: function() {
        this.validation.name.required = false;
      },

      'null is valid': function() {
        assert(
          this.model.set(
            {
              name: null
            },
            { validate: true }
          )
        );
      },

      'undefined is valid': function() {
        assert(
          this.model.set(
            {
              name: undefined
            },
            { validate: true }
          )
        );
      }
    },

    'when required:true': {
      beforeEach: function() {
        this.validation.name.required = true;
      },

      'undefined is invalid': function() {
        refute(
          this.model.set(
            {
              name: undefined
            },
            { validate: true }
          )
        );
      },

      'null is invalid': function() {
        refute(
          this.model.set(
            {
              name: null
            },
            { validate: true }
          )
        );
      }
    }
  }
};

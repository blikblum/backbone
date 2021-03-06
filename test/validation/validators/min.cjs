module.exports = {
  'min validator': {
    beforeEach: function() {
      this.validation = {
        age: {
          min: 1
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

    'has default error message': function(done) {
      this.model.on('validated', function(model, error) {
        assert.equals({ age: 'Age must be greater than or equal to 1' }, error);
        done();
      });
      this.model.set({ age: 0 }, { validate: true });
    },

    'number lower than min is invalid': function() {
      refute(
        this.model.set(
          {
            age: 0
          },
          { validate: true }
        )
      );
    },

    'non numeric value is invalid': function() {
      refute(
        this.model.set(
          {
            age: '10error'
          },
          { validate: true }
        )
      );
    },

    'number equal to min is valid': function() {
      assert(
        this.model.set(
          {
            age: 1
          },
          { validate: true }
        )
      );
    },

    'number greater than min is valid': function() {
      assert(
        this.model.set(
          {
            age: 2
          },
          { validate: true }
        )
      );
    },

    'numeric string values are treated as numbers': function() {
      assert(
        this.model.set(
          {
            age: '1'
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
              age: undefined
            },
            { validate: true }
          )
        );
      },

      'null is invalid': function() {
        refute(
          this.model.set(
            {
              age: null
            },
            { validate: true }
          )
        );
      }
    },

    'when required:false': {
      beforeEach: function() {
        this.validation.age.required = false;
      },

      'null is valid': function() {
        assert(
          this.model.set(
            {
              age: null
            },
            { validate: true }
          )
        );
      },

      'undefined is valid': function() {
        assert(
          this.model.set(
            {
              age: undefined
            },
            { validate: true }
          )
        );
      }
    },

    'when required:true': {
      beforeEach: function() {
        this.validation.age.required = true;
      },

      'undefined is invalid': function() {
        refute(
          this.model.set(
            {
              age: undefined
            },
            { validate: true }
          )
        );
      },

      'null is invalid': function() {
        refute(
          this.model.set(
            {
              age: null
            },
            { validate: true }
          )
        );
      }
    },

    'when min:0, 0 < val < 1': {
      setUp: function() {
        this.validation.aFloat = {
          min: 0
        };
      },
      "val is string, no leading zero, e.g. '.2'": function() {
        assert(
          this.model.set(
            {
              aFloat: '.2'
            },
            { validate: true }
          )
        );
      },
      "val is string, leading zero, e.g. '0.2'": function() {
        assert(
          this.model.set(
            {
              aFloat: '0.2'
            },
            { validate: true }
          )
        );
      },
      'val is number, leading zero, e.g. 0.2': function() {
        assert(
          this.model.set(
            {
              aFloat: 0.2
            },
            { validate: true }
          )
        );
      }
    }
  }
};

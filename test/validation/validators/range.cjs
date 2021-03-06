module.exports = {
  'range validator': {
    beforeEach: function() {
      this.validation = {
        age: {
          range: [1, 10]
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
        assert.equals({ age: 'Age must be between 1 and 10' }, error);
        done();
      });
      this.model.set({ age: 0 }, { validate: true });
    },

    'number lower than first value is invalid': function() {
      refute(
        this.model.set(
          {
            age: 0
          },
          { validate: true }
        )
      );
    },

    'number equal to first value is valid': function() {
      assert(
        this.model.set(
          {
            age: 1
          },
          { validate: true }
        )
      );
    },

    'number higher than last value is invalid': function() {
      refute(
        this.model.set(
          {
            age: 11
          },
          { validate: true }
        )
      );
    },

    'number equal to last value is valid': function() {
      assert(
        this.model.set(
          {
            age: 10
          },
          { validate: true }
        )
      );
    },

    'number in range is valid': function() {
      assert(
        this.model.set(
          {
            age: 5
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
    }
  }
};

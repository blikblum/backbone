module.exports = {
  'required validator': {
    beforeEach: function() {
      var that = this;

      @withValidation
      class Model extends Backbone.Model {
        static validation = {
          name: {
            required: true
          },
          agree: {
            required: true
          },
          posts: {
            required: true
          },
          dependsOnName: {
            required: function(val, attr, computed) {
              that.ctx = this;
              that.attr = attr;
              that.computed = computed;
              return this.get('name') === 'name';
            }
          }
        };

        set(...args) {
          super.set(...args);
          return this.validationError === null;
        }
      }

      this.model = new Model({
        name: 'name',
        agree: true,
        posts: ['post'],
        dependsOnName: 'depends'
      });
    },

    'has default error message': function(done) {
      this.model.on('validated', function(model, error) {
        assert.equals({ name: 'Name is required' }, error);
        done();
      });
      this.model.set({ name: '' }, { validate: true });
    },

    'empty string is invalid': function() {
      refute(
        this.model.set(
          {
            name: ''
          },
          { validate: true }
        )
      );
    },

    'non-empty string is valid': function() {
      assert(
        this.model.set(
          {
            name: 'a'
          },
          { validate: true }
        )
      );
    },

    'string with just spaces is invalid': function() {
      refute(
        this.model.set(
          {
            name: '  '
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

    'false boolean is valid': function() {
      assert(
        this.model.set(
          {
            agree: false
          },
          { validate: true }
        )
      );
    },

    'true boolean is valid': function() {
      assert(
        this.model.set(
          {
            agree: true
          },
          { validate: true }
        )
      );
    },

    'empty array is invalid': function() {
      refute(
        this.model.set(
          {
            posts: []
          },
          { validate: true }
        )
      );
    },

    'non-empty array is valid': function() {
      assert(
        this.model.set(
          {
            posts: ['post']
          },
          { validate: true }
        )
      );
    },

    'required can be specified as a method returning true or false': function() {
      this.model.set({ name: 'aaa' }, { validate: true });

      assert(
        this.model.set(
          {
            dependsOnName: undefined
          },
          { validate: true }
        )
      );

      this.model.set({ name: 'name' }, { validate: true });

      refute(
        this.model.set(
          {
            dependsOnName: undefined
          },
          { validate: true }
        )
      );
    },

    'context is the model': function() {
      this.model.set(
        {
          dependsOnName: ''
        },
        { validate: true }
      );
      assert.same(this.ctx, this.model);
    },

    'second argument is the name of the attribute being validated': function() {
      this.model.set({ dependsOnName: '' }, { validate: true });
      assert.equals('dependsOnName', this.attr);
    },

    'third argument is a computed model state': function() {
      this.model.set({ attr: 'attr' });
      this.model.set(
        {
          name: 'name',
          posts: ['post'],
          dependsOnName: 'value'
        },
        { validate: true }
      );

      assert.equals(
        {
          agree: true,
          attr: 'attr',
          dependsOnName: 'value',
          name: 'name',
          posts: ['post']
        },
        this.computed
      );
    }
  }
};

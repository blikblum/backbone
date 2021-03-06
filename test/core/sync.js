(function(QUnit) {
  var Library = class extends Backbone.Collection {
    url() {
      return '/library';
    }
  };
  var library;

  var attrs = {
    title: 'The Tempest',
    author: 'Bill Shakespeare',
    length: 123
  };

  QUnit.module('Backbone.sync', {
    beforeEach: function(assert) {
      library = new Library();
      library.create(attrs, { wait: false });
    }
  });

  QUnit.test('read', function(assert) {
    assert.expect(4);
    library.fetch();
    assert.equal(this.ajaxSettings.url, '/library');
    assert.equal(this.ajaxSettings.type, 'GET');
    assert.equal(this.ajaxSettings.dataType, 'json');
    assert.ok(_.isEmpty(this.ajaxSettings.data));
  });

  QUnit.test('passing data', function(assert) {
    assert.expect(3);
    library.fetch({ data: { a: 'a', one: 1 } });
    assert.equal(this.ajaxSettings.url, '/library');
    assert.equal(this.ajaxSettings.data.a, 'a');
    assert.equal(this.ajaxSettings.data.one, 1);
  });

  QUnit.test('create', function(assert) {
    assert.expect(6);
    assert.equal(this.ajaxSettings.url, '/library');
    assert.equal(this.ajaxSettings.type, 'POST');
    assert.equal(this.ajaxSettings.dataType, 'json');
    var data = JSON.parse(this.ajaxSettings.data);
    assert.equal(data.title, 'The Tempest');
    assert.equal(data.author, 'Bill Shakespeare');
    assert.equal(data.length, 123);
  });

  QUnit.test('update', function(assert) {
    assert.expect(7);
    library.first().save({ id: '1-the-tempest', author: 'William Shakespeare' });
    assert.equal(this.ajaxSettings.url, '/library/1-the-tempest');
    assert.equal(this.ajaxSettings.type, 'PUT');
    assert.equal(this.ajaxSettings.dataType, 'json');
    var data = JSON.parse(this.ajaxSettings.data);
    assert.equal(data.id, '1-the-tempest');
    assert.equal(data.title, 'The Tempest');
    assert.equal(data.author, 'William Shakespeare');
    assert.equal(data.length, 123);
  });

  QUnit.test('read model', function(assert) {
    assert.expect(3);
    library.first().save({ id: '2-the-tempest', author: 'Tim Shakespeare' });
    library.first().fetch();
    assert.equal(this.ajaxSettings.url, '/library/2-the-tempest');
    assert.equal(this.ajaxSettings.type, 'GET');
    assert.ok(_.isEmpty(this.ajaxSettings.data));
  });

  QUnit.test('destroy', function(assert) {
    assert.expect(3);
    library.first().save({ id: '2-the-tempest', author: 'Tim Shakespeare' });
    library.first().destroy({ wait: true });
    assert.equal(this.ajaxSettings.url, '/library/2-the-tempest');
    assert.equal(this.ajaxSettings.type, 'DELETE');
    assert.equal(this.ajaxSettings.data, null);
  });

  QUnit.test('urlError', function(assert) {
    assert.expect(2);
    var model = new Backbone.Model();
    assert.raises(function() {
      model.fetch();
    });
    model.fetch({ url: '/one/two' });
    assert.equal(this.ajaxSettings.url, '/one/two');
  });

  QUnit.test('#1052 - `options` is optional.', function(assert) {
    assert.expect(0);
    var model = new Backbone.Model();
    model.url = '/test';
    Backbone.sync.handler('create', model);
  });

  QUnit.test('Backbone.ajax', function(assert) {
    assert.expect(1);
    Backbone.ajax.handler = function(settings) {
      assert.strictEqual(settings.url, '/test');
      return Promise.resolve();
    };
    var model = new Backbone.Model();
    model.url = '/test';
    Backbone.sync.handler('create', model);
  });

  QUnit.test('Call provided error callback on error.', function(assert) {
    assert.expect(1);
    var model = new Backbone.Model();
    model.url = '/test';
    Backbone.sync.handler('read', model, {
      error: function() {
        assert.ok(true);
      }
    });
    this.ajaxSettings.error();
  });

  QUnit.test('isLoading with customized sync method.', function(assert) {
    assert.expect(4);
    var done = assert.async();
    class SpecialSyncModel extends Backbone.Model {
      sync() {
        return Promise.resolve({ x: 'y' });
      }
    }
    var model = new SpecialSyncModel();
    model.url = '/test';
    assert.equal(model.isLoading, false);
    model
      .fetch({
        success() {
          assert.equal(model.isLoading, false);
        }
      })
      .then(function() {
        assert.equal(model.isLoading, false);
        done();
      });
    assert.equal(model.isLoading, true);
  });

  QUnit.test('#2928 - Pass along `textStatus` and `errorThrown`.', function(assert) {
    assert.expect(3);
    var done = assert.async();
    var model = new Backbone.Model();
    model.url = '/test';
    model.on('error', function(m, error) {
      assert.ok(error instanceof Error);
      assert.deepEqual(error.responseData, { message: 'oh no!' });
      assert.strictEqual(error.textStatus, 'textStatus');
      done();
    });
    var ajax = Backbone.ajax.handler;
    Backbone.ajax.handler = function() {
      var error = new Error('not found');
      error.textStatus = 'textStatus';
      error.responseData = { message: 'oh no!' };
      return Promise.reject(error);
    };
    model.fetch();
    Backbone.ajax.handler = ajax;
  });
})(QUnit);

var Backbone = require('backbone');
var PublishView = require('../../../../../../javascripts/cartodb3/components/modals/publish/publish-view');
var ConfigModel = require('../../../../../../javascripts/cartodb3/data/config-model');
var UserModel = require('../../../../../../javascripts/cartodb3/data/user-model');
var PrivacyCollection = require('../../../../../../javascripts/cartodb3/components/modals/publish/privacy-collection');
var VisDefinitionModel = require('../../../../../../javascripts/cartodb3/data/vis-definition-model');

describe('components/modals/publish/publish-view', function () {
  var view;
  var userModel;
  var collection;
  var configModel;

  configModel = new ConfigModel({
    base_url: '/u/pepe'
  });

  beforeEach(function () {
    jasmine.Ajax.install();
    jasmine.Ajax.stubRequest(new RegExp('^http(s)?.*grantables.*'))
      .andReturn({ status: 200 });

    userModel = new UserModel({
      id: 1,
      username: 'pepe',
      avatar_url: 'https://example.com/avatar.jpg',
      actions: {
        private_tables: true,
        private_maps: true
      }
    }, {
      configModel: configModel
    });

    userModel._organizationModel = new Backbone.Model({
      id: 1
    });

    collection = new PrivacyCollection([{
      privacy: 'PUBLIC',
      title: 'Public',
      desc: 'Lorem ipsum',
      cssClass: 'is-green',
      selected: true
    }, {
      privacy: 'LINK',
      title: 'Link',
      desc: 'Yabadababa',
      cssClass: 'is-orange'
    }, {
      privacy: 'PASSWORD',
      title: 'Password',
      desc: 'Wadus'
    }, {
      privacy: 'PRIVATE',
      title: 'Private',
      desc: 'Funínculo',
      cssClass: 'is-red'
    }]);

    var mapcapsCollection = new Backbone.Collection([{
      created_at: '2016-06-21T15:30:06+00:00'
    }]);

    var visDefinitionModel = new VisDefinitionModel({
      name: 'Foo Map',
      privacy: 'PUBLIC',
      updated_at: '2016-06-21T15:30:06+00:00',
      type: 'derived',
      permission: {}
    }, {
      configModel: configModel
    });

    view = new PublishView({
      mapcapsCollection: mapcapsCollection,
      modalModel: new Backbone.Model(),
      visDefinitionModel: visDefinitionModel,
      privacyCollection: collection,
      userModel: userModel,
      configModel: configModel
    });

    view.render();
  });

  afterEach(function () {
    view.remove();
    jasmine.Ajax.uninstall();
  });

  it('should render properly', function () {
    expect(view.$el.html()).toContain('Foo Map');
    expect(view.$('.js-toggle').length).toBe(1);
    expect(view.$('.js-toggle').text()).toContain('PUBLIC');
    expect(view.$('.js-share-users').length).toBe(1);
    expect(view.$('.js-panes').length).toBe(1);
    expect(view.$('.js-menu').length).toBe(1);
    expect(view.$('.Publish-modalLink').length).toBe(2);
  });

  it('should render properly in share in single mode', function () {
    view.mode = 'share';
    view.render();

    expect(view.$el.html()).toContain('Foo Map');
    expect(view.$('.js-menu').length).toBe(0);
    expect(view.$('.Publish-modalLink').length).toBe(0);
  });

  it('should render properly for users without organization', function () {
    userModel._organizationModel = false;
    view.render();

    expect(view.$el.html()).toContain('Foo Map');
    expect(view.$('.js-menu').length).toBe(0);
    expect(view.$('.js-share-users').length).toBe(0); // share badget
    expect(view.$('.Publish-modalLink').length).toBe(0); // it runs in single mode without tabs and share view
  });

  describe('privacy button behaviour with privacy restrictions', function () {
    var visDefinitionModel;
    var configModel;
    var userModel;
    var view;

    beforeEach(function () {
      configModel = new ConfigModel({
        base_url: '/u/pepe'
      });

      visDefinitionModel = new VisDefinitionModel({
        name: 'Foo Map',
        privacy: 'PUBLIC',
        updated_at: '2016-06-21T15:30:06+00:00',
        type: 'derived',
        permission: {}
      }, { configModel: configModel });

      userModel = new UserModel({
        actions: {
          private_maps: false,
          private_tables: false
        }
      }, { configModel: configModel });
    });

    it('should hide the privacy button if the map is not published', function () {
      var mapcapsCollection = new Backbone.Collection([]);

      view = new PublishView({
        visDefinitionModel: visDefinitionModel,
        modalModel: new Backbone.Model(),
        mapcapsCollection: mapcapsCollection,
        privacyCollection: collection,
        userModel: userModel,
        configModel: configModel,
        clean_on_hide: true
      });

      view.render();
      expect(view.$('.js-dropdown').length).toBeFalsy();

      var data = [{
        created_at: '2016-06-21T15:30:06+00:00'
      }];

      view._mapcapsCollection.add(data, {at: 0});
      expect(view.$('.js-dropdown').length).toBe(1);
    });

    it('should show the privacy button if the map is published', function () {
      var mapcapsCollection = new Backbone.Collection([{
        created_at: '2016-06-21T15:30:06+00:00'
      }]);

      view = new PublishView({
        visDefinitionModel: visDefinitionModel,
        userModel: userModel,
        modalModel: new Backbone.Model(),
        privacyCollection: collection,
        mapcapsCollection: mapcapsCollection,
        configModel: configModel,
        clean_on_hide: true
      });

      view.render();

      expect(view.$('.js-dropdown').length).toBe(1);
    });
  });

  describe('privacy button behaviour without privacy restrictions', function () {
    var visDefinitionModel;
    var configModel;
    var userModel;
    var view;

    beforeEach(function () {
      configModel = new ConfigModel({
        base_url: '/u/pepe'
      });

      visDefinitionModel = new VisDefinitionModel({
        name: 'Foo Map',
        privacy: 'PUBLIC',
        updated_at: '2016-06-21T15:30:06+00:00',
        type: 'derived',
        permission: {}
      }, { configModel: configModel });

      userModel = new UserModel({
        actions: {
          private_maps: true,
          private_tables: true
        }
      }, { configModel: configModel });
    });

    it('should hide the privacy button if the map is not published', function () {
      var mapcapsCollection = new Backbone.Collection([]);

      view = new PublishView({
        visDefinitionModel: visDefinitionModel,
        userModel: userModel,
        modalModel: new Backbone.Model(),
        privacyCollection: collection,
        mapcapsCollection: mapcapsCollection,
        configModel: configModel,
        clean_on_hide: true
      });

      view.render();

      expect(view.$('.js-dropdown').length).toBe(1);
    });

    it('should show the privacy button if the map is published', function () {
      var mapcapsCollection = new Backbone.Collection([{
        created_at: '2016-06-21T15:30:06+00:00'
      }]);

      view = new PublishView({
        visDefinitionModel: visDefinitionModel,
        userModel: userModel,
        modalModel: new Backbone.Model(),
        mapcapsCollection: mapcapsCollection,
        privacyCollection: collection,
        configModel: configModel,
        clean_on_hide: true
      });

      view.render();

      expect(view.$('.js-dropdown').length).toBe(1);
    });
  });

  it('should not have any leaks', function () {
    expect(view).toHaveNoLeaks();
  });
});

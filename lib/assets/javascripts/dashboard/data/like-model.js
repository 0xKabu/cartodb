var Backbone = require('backbone');
var _ = require('underscore');

var LikeModel = Backbone.Model.extend({

  defaults: {
    likeable: true
  },

  url: function (method) {
    var version = this._config.urlVersion('like', method);
    return '/api/' + version + '/viz/' + this.get('vis_id') + '/like';
  },

  initialize: function (attrs, options) {
    if (!options.config) {
      throw new Error('config model is required');
    }

    this._config = options.config;

    _.bindAll(this, '_onSaveError');

    this.on('destroy', function () {
      this.set({
        liked: false,
        likes: this.get('likes') - 1
      });
    }, this);
  },

  _onSaveError: function (model, response) {
    this.trigger('error', {
      status: response.status,
      statusText: response.statusText
    });
  },

  toggleLiked: function () {
    if (this.get('liked')) {
      this.destroy();
    } else {
      this.set({ id: null }, { silent: true });
      this.save({}, { error: this._onSaveError });
    }
  }

}, {

  newByVisData: function (opts) {
    var d = _.defaults({
      id: opts.liked ? opts.vis_id : null
    }, _.omit(opts, 'url', 'config'));

    var m = new LikeModel(d, {
      config: opts.config
    });

    if (opts.url) {
      m.url = opts.url;
    }

    return m;
  }
});

module.exports = LikeModel;

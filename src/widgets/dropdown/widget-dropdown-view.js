var $ = require('jquery');
var _ = require('underscore');
var cdb = require('cartodb.js');
var template = require('./template.tpl');

/**
 * Standard widget dropdown view
 *
 */
module.exports = cdb.core.View.extend({

  _WIDGET_BOTTOM_PADDING: 20,

  className: 'CDB-Dropdown',

  events: {
    'click .js-togglePinned': '_togglePinned',
    'click .js-toggleCollapsed': '_toggleCollapsed',
    'click .js-normalize': '_normalize'
  },

  initialize: function (opts) {
    if (!opts.target) {
      throw new Error('target is not defined');
    }

    this.model = new cdb.core.Model({
      open: false,
      collapsed: opts.collapsed || false,
      pinned: opts.pinned || false
    });

    this._$target = this.options.target;
    this._$container = this.options.container;
    this.options.flags = this.options.flags || {};
    _.defaults(this.options.flags, {
      normalizeHistogram: false
    });
    this._initBinds();
  },

  render: function () {
    this.$el.html(template(
      _.extend(this.options.flags, {
        collapsed: this.model.get('collapsed'),
        pinned: this.model.get('pinned')
      })
    ));
    return this;
  },

  _initBinds: function () {
    this.add_related_model(this.model);

    this.model.bind('change:open', this._onChangeOpen, this);

    this._$target.click(
      _.bind(this._toggleClick, this)
    );
  },

  _bindGlobalClick: function () {
    $(document).bind('click.' + this.cid, _.bind(this._onGlobalClick, this));
  },

  _unbindGlobalClick: function () {
    $(document).unbind('click.' + this.cid);
  },

  _bindESC: function () {
    $(document).bind('keyup.' + this.cid, _.bind(this._onKeyUp, this));
  },

  _unbindESC: function () {
    $(document).unbind('keyup.' + this.cid);
  },

  _onGlobalClick: function (ev) {
    if (this._$target.get(0) !== $(ev.target).closest(this._$target).get(0)) {
      this.model.set('open', false);
    }
  },

  _onKeyUp: function (ev) {
    if (ev.keyCode === 27) {
      this.model.set('open', false);
      return false;
    }
  },

  _onChangeOpen: function () {
    if (this.model.get('open')) {
      this._open();
    } else {
      this._close();
    }
  },

  _togglePinned: function () {
    var pinned = !this.model.get('pinned');
    this.$('.js-inputPinned').attr('checked', pinned);
    this.trigger('togglePinned', pinned);
  },

  _toggleCollapsed: function () {
    var collapsed = !this.model.get('collapsed');
    this.$('.js-inputCollapsed').attr('checked', collapsed);
    this.trigger('toggleCollapsed', collapsed);
  },

  _normalize: function () {
    this.model.set('normalize', !this.model.get('normalize'));
    this.trigger('click', 'normalize', this.model.get('normalize'));
  },

  _open: function () {
    this._bindESC();
    this._bindGlobalClick();

    this.render();
    this._$container.append(this.$el);
    this.$el.show();

    this._adjustVerticalPosition();
  },

  _adjustVerticalPosition: function () {
    var bodyHeight = $('body').height();
    var bottom = this.$el.offset().top + this.$el.height();

    this.$el.toggleClass('has-top-position', bottom + this._WIDGET_BOTTOM_PADDING > bodyHeight);
  },

  _close: function () {
    this._unbindESC();
    this._unbindGlobalClick();
    this.$el.hide();
  },

  _toggleClick: function () {
    this.model.set('open', !this.model.get('open'));
  },

  clean: function () {
    this._unbindESC();
    this._unbindGlobalClick();
    this._$target.off('click');
    cdb.core.View.prototype.clean.call(this);
  }
});

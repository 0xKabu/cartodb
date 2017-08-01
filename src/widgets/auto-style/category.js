var _ = require('underscore');
var AutoStyler = require('./auto-styler');
var StyleUtils = require('./style-utils');

module.exports = AutoStyler.extend({
  getStyle: function () {
    var style = this.layer.get('initialStyle');
    if (!style) return;

    AutoStyler.FILL_SELECTORS.forEach(function (item) {
      style = StyleUtils.changeStyle(style, item, this._generateCategoryRamp());
    }.bind(this));

    AutoStyler.OPACITY_SELECTORS.forEach(function (item) {
      style = StyleUtils.changeStyle(style, item, this.opacity);
    }.bind(this));

    return StyleUtils.replaceWrongSpaceChar(style);
  },

  getRange: function () {
    return _.map(this.dataviewModel.get('data'), function (category) {
      return this.colors.getColorByCategory(category.name);
    }, this);
  },

  getDef: function () {
    var model = this.dataviewModel;
    var categories = model.get('data');
    var range = this.getRange();
    var definitions = {};

    AutoStyler.FILL_SELECTORS.forEach(function (item) {
      var definition = {};
      var geom = item.substring(0, item.indexOf('-'));
      definition = { color:
        { domain: _.pluck(categories, 'name'), range: range, attribute: model.get('column') }
      };
      definitions[geom === 'marker' ? 'point' : geom] = definition;
    });

    return definitions;
  },

  _generateCategoryRamp: function () {
    var model = this.dataviewModel;
    var categories = model.get('data');
    var column = model.get('column');

    return this._getCategoryRamp(categories, column);
  },

  _getCategoryRamp: function (categories, column) {
    var ramp = 'ramp([' + column + '], ';

    var catListColors = '';
    var catListValues = '';

    for (var i = 0; i < categories.length; i++) {
      var cat = categories[i];
      var start = '"';
      var end = i !== categories.length - 1 ? '", ' : '"';

      catListColors += start + this.colors.getColorByCategory(cat.name) + end;
      if (!cat.agg) {
        catListValues += start + cat.name.replace(/"/g, '\\"') + end;
      } else if (end === '"') {
        catListValues = catListValues.substring(0, catListValues.length - 2);
      }
    }

    return ramp + '(' + catListColors + '), (' + catListValues + '))';
  }
});

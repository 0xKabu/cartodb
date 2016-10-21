var AutoStyler = require('./auto-styler');
var StyleUtils = require('./style-utils');

module.exports = AutoStyler.extend({
  getStyle: function () {
    var style = this.layer.get('initialStyle');
    if (!style) return;

    ['marker-fill', 'polygon-fill', 'line-color'].forEach(function (item) {
      style = StyleUtils.changeStyle(style, item, this._generateCategoryRamp(item));
    }.bind(this));

    return StyleUtils.replaceWrongSpaceChar(style);
  },

  _generateCategoryRamp: function (sym) {
    var model = this.dataviewModel;
    var categories = model.get('data');
    var column = model.get('column');

    return sym + ': ' + this._getCategoryRamp(categories, column);
  },

  _getCategoryRamp: function (categories, column) {
    var ramp = 'ramp([' + column + '],';

    var catListColors = '';
    var catListValues = '';

    for (var i = 0; i < categories.length; i++) {
      var cat = categories[i];
      var start = "'";
      var end = i !== categories.length - 1 ? "', " : "'";

      catListColors += start + this.colors.getColorByCategory(cat.name) + end;
      if (!cat.agg) {
        catListValues += start + cat.name.replace(/'/g, '\\\'') + end;
      }
    }

    return ramp + '(' + catListColors + '), (' + catListValues + '));';
  }
});

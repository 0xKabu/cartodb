var _ = require('underscore');
var cartocolor = require('cartocolor');
var AutoStyler = require('./auto-styler');
var StyleUtils = require('./style-utils');
var getValue = require('../../util/get-object-value');

var FILL_SELECTORS = ['marker-fill', 'polygon-fill', 'line-color'];
var OPACITY_SELECTORS = ['marker-fill-opacity', 'polygon-opacity', 'line-opacity'];

var HistogramAutoStyler = AutoStyler.extend({
  getStyle: function () {
    var style = this.layer.get('initialStyle');
    if (!style) return;

    FILL_SELECTORS.forEach(function (item) {
      style = StyleUtils.changeStyle(style, item, this.getColorLine(item, this.getCustomStyle()));
    }.bind(this));

    OPACITY_SELECTORS.forEach(function (item) {
      style = StyleUtils.changeStyle(style, item, this.opacity);
    }.bind(this));

    return StyleUtils.replaceWrongSpaceChar(style);
  },

  getCustomStyle: function () {
    return getValue(this.styles, 'definition.color');
  },

  updateColors: function (style) {
    this.styles = style.auto_style;
  },

  getColorLine: function (sym, custom) {
    var scales = custom || {};

    if (!custom) {
      var shape = this.dataviewModel.getDistributionType(
        this.dataviewModel.getUnfilteredDataModel().get('data')
      );

      scales = HistogramAutoStyler.SCALES_MAP[sym][shape];
    }

    var ramp = 'ramp([' + this.dataviewModel.get('column') + '], ';
    var colors = custom ? "('" + scales.range.join("', '") + "'), "
      : 'cartocolor(' + scales.palette + ', ' + this.dataviewModel.get('bins') + '), ';
    var cuantification = scales.quantification + ')';

    return ramp + colors + cuantification;
  },

  getDef: function (cartocss) {
    var definitions = {};
    var shape = this.dataviewModel.getDistributionType(
      this.dataviewModel.getUnfilteredDataModel().get('data')
    );
    var bins = this.dataviewModel.get('bins');
    var attr = this.dataviewModel.get('column');
    var styles = this.styles;
    var isCustomDefinition = this.styles && this.styles.custom || false;

    FILL_SELECTORS.forEach(function (item) {
      if (StyleUtils.isPropertyIncluded(cartocss, item)) {
        var scales = HistogramAutoStyler.SCALES_MAP[item][shape];
        var geom = item.substring(0, item.indexOf('-'));
        var definition = {};

        if (scales) {
          if (isCustomDefinition === true) {
            definition = _.extend(definition, styles.definition);
          } else {
            definition = {
              color: {
                range: cartocolor[scales.palette][bins] || cartocolor[scales.palette][Object.keys(cartocolor[scales.palette]).length],
                quantification: scales.quantification,
                attribute: attr
              }
            };
          }
        }

        definitions[geom === 'marker' ? 'point' : geom] = definition;
      }
    });

    return definitions;
  }

});

HistogramAutoStyler.SCALES_MAP = {
  'polygon-fill': {
    'F': {
      palette: 'PinkYl',
      quantification: 'equal'
    },
    'L': {
      palette: 'Emrld',
      quantification: 'headtails'
    },
    'J': {
      palette: 'Emrld',
      quantification: 'headtails'
    },
    'A': {
      palette: 'Geyser',
      quantification: 'quantiles'
    },
    'C': {
      palette: 'Sunset',
      quantification: 'jenks'
    },
    'U': {
      palette: 'Sunset',
      quantification: 'jenks'
    }
  },
  'line-color': {
    'F': {
      palette: 'PinkYl',
      quantification: 'equal'
    },
    'L': {
      palette: 'Emrld',
      quantification: 'headtails'
    },
    'J': {
      palette: 'Emrld',
      quantification: 'headtails'
    },
    'A': {
      palette: 'Geyser',
      quantification: 'quantiles'
    },
    'C': {
      palette: 'Sunset',
      quantification: 'jenks'
    },
    'U': {
      palette: 'Sunset',
      quantification: 'jenks'
    }
  },
  'marker-fill': {
    'F': {
      palette: 'RedOr',
      quantification: 'equal'
    },
    'L': {
      palette: 'BluYl',
      quantification: 'headtails'
    },
    'J': {
      palette: 'BluYl',
      quantification: 'headtails'
    },
    'A': {
      palette: 'Geyser',
      quantification: 'quantiles'
    },
    'C': {
      palette: 'SunsetDark',
      quantification: 'jenks'
    },
    'U': {
      palette: 'SunsetDark',
      quantification: 'jenks'
    }
  }
};

module.exports = HistogramAutoStyler;

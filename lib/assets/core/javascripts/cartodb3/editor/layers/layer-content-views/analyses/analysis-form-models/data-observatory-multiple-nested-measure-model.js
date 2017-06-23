var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var DataObservatoryNormalize = require('../../../../../data/data-observatory/normalize-collection');
var DataObservatoryTimespan = require('../../../../../data/data-observatory/timespan-collection');
var DataObservatoryBoundaries = require('../../../../../data/data-observatory/boundaries-collection');
var MeasurementsCollection = require('../../../../../data/data-observatory/measurements-collection');
var DataObservatoryColumnName = require('../../../../../data/data-observatory/column-name');
var checkAndBuildOpts = require('../../../../../helpers/required-opts');

var REQUIRED_OPTS = [
  'regions',
  'form',
  'configModel',
  'nodeDefModel'
];

var DENOMINATORS_BLACKLIST = ['', 'area'];

var wrap = function (value) {
  var result = "'" + value + "'";
  return result;
};

var braces = function (value) {
  return "'{" + value + "}'";
};

module.exports = Backbone.Model.extend({
  defaults: {
    normalization: 'denormalized',
    normalize: '',
    timespan: null,
    boundaries: null,
    column_name: ''
  },

  initialize: function (attrs, options) {
    checkAndBuildOpts(options, REQUIRED_OPTS, this);

    var fetchOptions = {
      configModel: this._configModel,
      nodeDefModel: this._nodeDefModel
    };

    this.measurements = new MeasurementsCollection([], fetchOptions);
    this.normalize = new DataObservatoryNormalize(null, fetchOptions);
    this.timespan = new DataObservatoryTimespan(null, fetchOptions);
    this.boundaries = new DataObservatoryBoundaries(null, fetchOptions);
    this.columnName = new DataObservatoryColumnName(fetchOptions);

    this._fetchMeasurements = this._fetchMeasurements.bind(this);
    this._syncMeasurements = this._syncMeasurements.bind(this);
    this._fetchNormalize = this._fetchNormalize.bind(this);
    this._syncNormalize = this._syncNormalize.bind(this);
    this._fetchTimespan = this._fetchTimespan.bind(this);
    this._syncTimespan = this._syncTimespan.bind(this);
    this._fetchBoundaries = this._fetchBoundaries.bind(this);
    this._syncBoundaries = this._syncBoundaries.bind(this);
    this._fetchNewColumn = this._fetchNewColumn.bind(this);
    this._columnNameSuccess = this._columnNameSuccess.bind(this);
    this._setSchema = this._setSchema.bind(this);

    if (this.get('normalization') === 'area' && !this.get('normalize')) {
      this.set({ normalize: 'area' });
    }

    this._initBinds();
    this._setSchema();
    this._fetchMeasurements()
      .then(this._syncMeasurements);
  },

  _initBinds: function () {
    // If measurement exists, we wait to get all measurement to fetch the rest of collections
    // because we need the type and aggregation of the selected measurement for normalization
    var measurement = this.get('segment_name');
    if (measurement) {
      this.listenToOnce(this.measurements, 'reset', this._checkIfMeasurementExist);
    }

    this.listenTo(this._form.model, 'change:area', this._regionChanged);
    this.listenTo(this.measurements.stateModel, 'change:state', this._setSchema);
    this.listenTo(this.normalize.stateModel, 'change:state', this._setSchema);
    this.listenTo(this.timespan.stateModel, 'change:state', this._setSchema);
    this.listenTo(this.boundaries.stateModel, 'change:state', this._setSchema);
    this.on('change:segment_name', this._measurementChanged, this);
    this.on('change:normalize', this._normalizeChanged, this);
    this.on('change:timespan', this._timestampChanged, this);
  },

  _checkIfMeasurementExist: function () {
    var measurement = this.get('segment_name');
    // If measurement is set, we fetch all collections
    if (measurement) {
      this._measurementChanged();
    }
  },

  _regionChanged: function () {
    this._fetchMeasurements()
      .then(this._syncMeasurements)
      .then(this._fetchNormalize)
      .then(this._syncNormalize)
      .then(this._fetchTimespan)
      .then(this._syncTimespan)
      .then(this._fetchBoundaries)
      .then(this._syncBoundaries)
      .then(this._fetchNewColumn);
  },

  _measurementChanged: function () {
    this._fetchNormalize()
      .then(this._syncNormalize)
      .then(this._fetchTimespan)
      .then(this._syncTimespan)
      .then(this._fetchBoundaries)
      .then(this._syncBoundaries)
      .then(this._fetchNewColumn);
  },

  _normalizeChanged: function () {
    this._setNormalization();
    this._fetchTimespan()
      .then(this._syncTimespan)
      .then(this._fetchBoundaries)
      .then(this._syncBoundaries)
      .then(this._fetchNewColumn);
  },

  _timestampChanged: function () {
    this._fetchBoundaries()
      .then(this._syncBoundaries)
      .then(this._fetchNewColumn);
  },

  _fetchMeasurements: function () {
    var area = this._form.model.get('area');
    var fetchOptions = {
      region: area && braces(area)
    };
    return this.measurements.fetch(fetchOptions);
  },

  _syncMeasurements: function () {
    var deferred = $.Deferred();
    var measurement = this.get('segment_name');
    var selected = this.measurements.setSelected(measurement);
    if (!selected) {
      this.set({ segment_name: null }, { silent: true });
    }
    deferred.resolve();
    return deferred.promise();
  },

  _fetchNormalize: function () {
    var fetchOptions = this._getUserSelection();
    return this.normalize.fetch(fetchOptions);
  },

  _syncNormalize: function () {
    var deferred = $.Deferred();
    var measurement = this.measurements.getSelectedItem();
    var normalize = this.get('normalize');
    var selected = this.normalize.setSelected(normalize);
    var areaAllowed = (measurement && measurement.get('type') === 'Numeric' && measurement.get('aggregate') === 'sum');

    if (!selected && normalize !== 'area' || !selected && normalize === 'area' && !areaAllowed) {
      this.set({ normalize: '' }, { silent: true });
      this._setSchema();
    }

    this._setNormalization();
    deferred.resolve();
    return deferred.promise();
  },

  _fetchTimespan: function () {
    var fetchOptions = this._getUserSelection();
    return this.timespan.fetch(fetchOptions);
  },

  _syncTimespan: function () {
    var deferred = $.Deferred();
    var timespan = this.get('timespan');
    var selected = this.timespan.setSelected(timespan);

    if (!selected) {
      this.timespan.selectFirstAsDefault();
      this._setSchema();
    }

    deferred.resolve();
    return deferred.promise();
  },

  _fetchBoundaries: function () {
    var fetchOptions = this._getUserSelection();
    return this.boundaries.fetch(fetchOptions);
  },

  _syncBoundaries: function () {
    var deferred = $.Deferred();
    var boundaries = this.get('boundaries');
    var selected = this.boundaries.setSelected(boundaries);
    if (!selected) {
      this.set({ boundaries: null }, { silent: true });
      this._setSchema();
    }
    deferred.resolve();
    return deferred.promise();
  },

  _fetchNewColumn: function () {
    var columnOptions = this._getColumnNameOptions();
    this.columnName.fetch(columnOptions);
  },

  _columnNameSuccess: function (data) {
    var rows;
    var metadata;

    rows = data.rows;
    if (!rows || rows.length === 0) return;

    metadata = rows[0].obs_getmeta;
    if (!metadata || metadata.length === 0) return;

    var suggestedName = metadata[0].suggested_name;

    this.set({ column_name: suggestedName });
    this._setSchema();
    this._form.trigger('change');
  },

  _setNormalization: function () {
    var denom = this.get('normalize');
    denom = denom === '' ? null : denom;
    var normalization = 'denormalized';

    if (denom) {
      normalization = (denom === 'area') ? 'area' : 'denominated';
    }

    this.set('normalization', normalization);
  },

  _getColumnNameOptions: function () {
    var normalize = this.get('normalize') || null;
    if (normalize !== null) {
      normalize = (DENOMINATORS_BLACKLIST.indexOf(normalize) >= 0) ? null : normalize;
    }
    var normalization = this.get('normalization');

    var defaults = {
      numer_id: null,
      denom_id: null,
      numer_timespan: null
    };

    var columnOptions = _.defaults({
      numer_id: this.get('segment_name'),
      denom_id: normalize,
      numer_timespan: this.get('timespan') || null,
      normalization: normalization
    }, defaults);

    return _.extend(
      {
        success: this._columnNameSuccess
      },
      _.pick(columnOptions, _.identity)
    );
  },

  _getNormalizeOptions: function () {
    var measurement = this.measurements.getSelectedItem();
    var options = this.normalize.models;

    if (measurement && measurement.get('type') === 'Numeric' && measurement.get('aggregate') === 'sum') {
      options = options.concat([{
        label: _t('analyses.data-observatory-measure.area'),
        val: 'area'
      }]);
    }

    return options;
  },

  _getTimespanOptions: function () {
    return this.timespan.models;
  },

  _getUserSelection: function () {
    var normalize = this.get('normalize');
    // We are inserting area option manually, so we need to filter that value for the backend
    normalize = (DENOMINATORS_BLACKLIST.indexOf(normalize) >= 0) ? null : wrap(normalize);

    var timespan = this.get('timespan');
    timespan = timespan != null ? wrap(timespan) : null;

    var region = wrap(this._form.model.get('area'));
    var measurement = wrap(this.get('segment_name'));

    return {
      region: region,
      measurement: measurement,
      denom_id: normalize,
      timespan: timespan
    };
  },

  _setSchema: function () {
    var normalizeOptions = this._getNormalizeOptions();
    var isDisabled = this.get('segment_name') == null || normalizeOptions.length === 0;
    var schema = {
      segment_name: {
        type: 'DataObservatoryDropdown',
        title: _t('editor.layers.analysis-form.data-observatory.measurements.label'),
        editorAttrs: {
          configModel: this._configModel,
          nodeDefModel: this._nodeDefModel,
          model: this._form.model,
          placeholder: _t('editor.layers.analysis-form.data-observatory.measurements.placeholder'),
          measurements: this.measurements,
          loading: this.measurements.stateModel.get('state') === 'fetching'
        },
        dialogMode: 'float',
        region: this._form.model.get('area'),
        validators: ['required']
      },
      normalize: {
        type: 'EnablerEditor',
        title: '',
        label: _t('editor.layers.analysis-form.data-observatory.normalize.label'),
        isDisabled: isDisabled,
        editor: {
          type: 'Select',
          options: normalizeOptions,
          dialogMode: 'float',
          editorAttrs: {
            disabled: isDisabled,
            showSearch: false,
            showLabel: false,
            loading: this.normalize.stateModel.get('state') === 'fetching'
          }
        }
      },
      timespan: {
        type: 'Select',
        title: _t('editor.layers.analysis-form.data-observatory.timespan.label'),
        options: this._getTimespanOptions(),
        dialogMode: 'float',
        loading: this.timespan.stateModel.get('state') === 'fetching',
        editorAttrs: {
          placeholder: _t('editor.layers.analysis-form.data-observatory.timespan.placeholder')
        }
      },
      boundaries: {
        type: 'Slider',
        title: _t('editor.layers.analysis-form.data-observatory.boundaries.label'),
        values: this.boundaries.getValues(),
        labels: this.boundaries.getLabels(),
        initial: 'highest'
      },
      column_name: {
        type: 'Hidden'
      },
      normalization: {
        type: 'Hidden'
      }
    };

    this.schema = schema;
    this.trigger('updateSchema', this.schema);
  }
});

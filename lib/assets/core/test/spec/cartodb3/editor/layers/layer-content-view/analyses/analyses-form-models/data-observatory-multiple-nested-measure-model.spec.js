var Backbone = require('backbone');
var ConfigModel = require('../../../../../../../../javascripts/cartodb3/data/config-model');
var AnalysisDefinitionNodeModel = require('../../../../../../../../javascripts/cartodb3/data/analysis-definition-node-model');
var DataObservatoryMeasureModel = require('../../../../../../../../javascripts/cartodb3/editor/layers/layer-content-views/analyses/analysis-form-models/data-observatory-multiple-nested-measure-model');
var cdb = require('cartodb.js');
var RegionsCollection = require('../../../../../../../../javascripts/cartodb3/data/data-observatory/regions-collection');

describe('editor/layers/layer-content-views/analyses/analysis-form-models/data-observatory-multiple-nested-measure-model', function () {
  var sqlExecuteBackup = cdb.SQL.prototype.execute;

  beforeEach(function () {
    var configModel = new ConfigModel({
      base_url: '/u/pepe',
      api_key: 'wadus',
      user_name: 'pepe'
    });

    this.querySchemaModel = new Backbone.Model({
      query: 'select * from wadus'
    });

    this.nodeDefModel = new AnalysisDefinitionNodeModel({
      id: 'a1',
      type: 'data-observatory-multiple-measures',
      numerators: ['foo', 'bar'],
      column_names: ['final_column', 'otra'],
      denominators: [null, null],
      numerator_timespans: [null, null],
      geom_ids: ['wadus', null],
      normalizations: ['area', 'area'],
      source: 'a0'
    }, {
      configModel: configModel,
      collection: this.analysisDefinitionNodesCollection
    });

    cdb.SQL.prototype.execute = function (query, vars, params) {
      var payload;

      if (/numers.numer_tags/.test(query)) {
        payload = {
          rows: [
            {
              num_measurements: 2,
              region_id: 'section/tags.global',
              region_name: '"Global"'
            }, {
              num_measurements: 634,
              region_id: 'section/tags.united_states',
              region_name: '"United States"'
            }
          ]
        };
      } else {
        payload = {
          rows: [
            {
              numer_id: 'us.zillow.AllHomes_Zhvi',
              numer_name: 'Zillow Home Value Index for All homes',
              numer_tags: '{"subsection/tags.housing": "Housing", "license/us.zillow.zillow-license": "Zillow Terms of Use for Aggregate Data", "subsection/us.census.acs.segments": "US Population Segments"}'
            },
            {
              numer_id: 'us.census.acs.B19083001',
              numer_name: 'Gini Index',
              numer_tags: '{"subsection/tags.age_gender": "Age and Gender", "license/tags.norestrictions": "Unrestricted"}'
            },
            {
              numer_id: 'us.census.acs.B01001002',
              numer_name: 'Male Population',
              numer_tags: '{"subsection/tags.age_gender": "Age and Gender", "license/tags.norestrictions": "Unrestricted"}'
            }
          ]
        };
      }

      params && params.success(payload);
    };

    this.regions = new RegionsCollection([], {
      configModel: configModel,
      nodeDefModel: this.nodeDefModel
    });

    this.regions.fetch();

    this.form = new Backbone.View();
    this.form.commit = jasmine.createSpy('commit');
    this.form.model = new Backbone.Model({
      area: 'Wadus'
    });

    this.model = new DataObservatoryMeasureModel(this.nodeDefModel.attributes, {
      configModel: configModel,
      nodeDefModel: this.nodeDefModel,
      regions: this.regions,
      form: this.form
    });
  });

  afterEach(function () {
    cdb.SQL.prototype.execute = sqlExecuteBackup;
  });

  it('should generate schema', function () {
    expect(this.model.schema).toBeDefined();
  });

  it('should have generated form fields', function () {
    expect(Object.keys(this.model.schema).length).toBe(6);
  });

  describe('suggested column', function () {
    beforeEach(function () {
      cdb.SQL.prototype.execute = function (query, vars, params) {
        params && params.success({
          rows: [
            {
              obs_getmeta: [
                {
                  suggested_name: 'wadus_2010_2014'
                }
              ]
            }
          ]
        });
      };

      spyOn(this.model, '_getColumnNameOptions').and.returnValue({
        success: this.model._columnNameSuccess,
        numer_id: 'wadus'
      });
    });

    it('should update suggested column', function () {
      this.model._fetchNewColumn();

      expect(this.model.get('column_name')).toBe('wadus_2010_2014');
    });
  });
});

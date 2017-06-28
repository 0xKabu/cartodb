var Backbone = require('backbone');
var cdb = require('cartodb.js');
var MeasurementsCollection = require('../../../../../javascripts/cartodb3/data/data-observatory/measurements-collection');
var AnalysisDefinitionNodeModel = require('../../../../../javascripts/cartodb3/data/analysis-definition-node-model');

describe('data/data-observatory/measurements-collection', function () {
  var sqlExecuteBackup = cdb.SQL.prototype.execute;

  beforeEach(function () {
    var configModel = new Backbone.Model({
      base_url: '/u/foo',
      user_name: 'foo',
      sql_api_template: 'foo',
      api_key: 'foo'
    });

    this.nodeDefModel = new AnalysisDefinitionNodeModel({
      id: 'a1',
      type: 'data-observatory-multiple-measures',
      final_column: 'foo',
      source: 'a0'
    }, {
      configModel: configModel,
      collection: new Backbone.Collection()
    });

    this.querySchemaModel = new Backbone.Model({
      query: 'select * from wadus'
    });

    this.nodeDefModel.querySchemaModel = this.querySchemaModel;

    cdb.SQL.prototype.execute = function (query, vars, params) {
      params && params.success({
        rows: [
          {
            numer_id: 'us.zillow.AllHomes_Zhvi',
            numer_name: 'Zillow Home Value Index for All homes',
            numer_tags: '{"subsection/tags.housing": "Housing", "license/us.zillow.zillow-license": "Zillow Terms of Use for Aggregate Data"}'
          },
          {
            numer_id: 'us.census.acs.B19083001',
            numer_name: 'Gini Index',
            numer_tags: '{"subsection/tags.income": "Income", "section/tags.united_states": "United States", "license/tags.no-restrictions": "Unrestricted"}'
          },
          {
            numer_id: 'us.census.acs.B01001002',
            numer_name: 'Male Population',
            numer_tags: '{"section/tags.united_states": "United States", "subsection/tags.age_gender": "Age and Gender", "license/tags.no-restrictions": "Unrestricted"}'
          }
        ]
      });
    };

    this.collection = new MeasurementsCollection([], {
      configModel: configModel,
      nodeDefModel: this.nodeDefModel
    });

    this.successCallback = jasmine.createSpy('successCallback');
    this.errorCallback = jasmine.createSpy('errorCallback');
  });

  afterEach(function () {
    cdb.SQL.prototype.execute = sqlExecuteBackup;
  });

  it('initial state', function () {
    expect(this.collection.getState()).toBe('unfetched');
  });

  it('fetch', function () {
    this.collection.fetch({
      success: this.successCallback,
      error: this.errorCallback
    });

    expect(this.successCallback).toHaveBeenCalled();
    expect(this.collection.length).toBe(3);
    expect(this.collection.getState()).toBe('fetched');
  });

  it('model', function () {
    this.collection.fetch({
      success: this.successCallback,
      error: this.errorCallback
    });

    var m = this.collection.at(0);
    expect(m.getValue()).toBe('us.zillow.AllHomes_Zhvi');
    expect(m.getName()).toBe('Zillow Home Value Index for All homes');
    expect(m.get('license')).toBe('Zillow Terms of Use for Aggregate Data');
  });

  it('getSelected', function () {
    var m = this.collection.at(0);
    this.collection.setSelected(m.getValue());

    var selected = this.collection.getSelected();
    expect(selected.get('value')).toBe(m.getValue());
  });
});

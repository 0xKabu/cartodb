var Backbone = require('backbone');
var ConfigModel = require('../../../../../../javascripts/cartodb3/data/config-model');
var ExportView = require('../../../../../../javascripts/cartodb3/components/modals/export-data/modal-export-data-view');

describe('components/modals/export-data/modal-export-data-view', function () {
  beforeEach(function () {
    this.configModel = new ConfigModel({
      base_url: '/u/pepe'
    });

    this.queryGeometryModel = new Backbone.Model({
      status: 'fetched',
      simple_geom: 'point'
    });

    spyOn(ExportView.prototype, 'submit');
    spyOn(ExportView.prototype, '_onConfirm');
    spyOn(ExportView.prototype, '_close');

    this.view = new ExportView({
      fileName: 'wadus',
      configModel: this.configModel,
      queryGeometryModel: this.queryGeometryModel,
      modalModel: {}
    });

    this.view.render();
  });

  describe('render', function () {
    it('should render properly for points', function () {
      expect(this.view.$('.Modal-listFormItem').length).toBe(5);
      expect(this.view.$('.Modal-listFormItem.is-disabled').length).toBe(0);
      expect(this.view.$('[data-format=csv]:checked').length).toBe(1);
    });

    it('should render properly for polygons', function () {
      this.queryGeometryModel.set('simple_geom', 'polygon');
      this.view.render();

      expect(this.view.$('.Modal-listFormItem').length).toBe(5);
      expect(this.view.$('.Modal-listFormItem.is-disabled').length).toBe(1);
      expect(this.view.$('[data-format=csv]:checked').length).toBe(0);
      expect(this.view.$('[data-format=shp]:checked').length).toBe(1);
    });
  });

  describe('events', function () {
    it('should trigger events properly', function () {
      this.view.$('.js-confirm').trigger('click');
      expect(ExportView.prototype._onConfirm).toHaveBeenCalled();

      this.view.$('.js-cancel').trigger('click');
      expect(ExportView.prototype._close).toHaveBeenCalled();
    });
  });

  it('should not have any leaks', function () {
    expect(this.view).toHaveNoLeaks();
  });
});

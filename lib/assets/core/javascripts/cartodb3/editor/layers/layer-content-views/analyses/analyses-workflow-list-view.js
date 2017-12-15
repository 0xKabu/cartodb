var CoreView = require('backbone/core-view');
var AnalysesWorkflowItemView = require('./analyses-workflow-item-view');
var template = require('./analyses-workflow-list.tpl');
var checkAndBuildOpts = require('../../../../helpers/required-opts');
var TipsyTooltipView = require('../../../../components/tipsy-tooltip-view');

var REQUIRED_OPTS = [
  'analysisDefinitionNodesCollection',
  'analysisFormsCollection',
  'layerId'
];

module.exports = CoreView.extend({

  className: 'HorizontalBlockList u-tSpace',
  tagName: 'ul',

  initialize: function (opts) {
    checkAndBuildOpts(opts, REQUIRED_OPTS, this);

    if (!opts.model) {
      throw new Error('model is required');
    }

    this.model = opts.model;
  },

  render: function () {
    this.clearSubViews();
    this.$el.html(template({
      layerId: this._layerId
    }));

    this._initViews();

    return this;
  },

  _initViews: function () {
    this._analysisFormsCollection.each(this._renderWorkflowItem, this);

    var tooltip = new TipsyTooltipView({
      el: this.$('.js-add'),
      gravity: 's',
      title: function () {
        return _t('add-analysis');
      }
    });
    this.addView(tooltip);
  },

  _renderWorkflowItem: function (formModel) {
    var view = new AnalysesWorkflowItemView({
      analysisNode: this._analysisDefinitionNodesCollection.get(formModel.id),
      formModel: formModel,
      viewModel: this.model,
      layerId: this._layerId
    });
    this.$el.append(view.render().el);
    this.addView(view);
  }
});

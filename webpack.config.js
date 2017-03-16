var path = require('path');
var webpack = require('webpack');

var webpackShimConfig = {
  shim: {
    'wax.cartodb.js': {
      exports: 'wax'
    },
    'html-css-sanitizer': {
      exports: 'html'
    }
  }
};

module.exports = {
  entry: {
    main: [
// Source map
'./lib/build/source-map-support.js',

// Needed to have Backbone.Form defined
'./lib/assets/core/javascripts/cartodb3/components/form-components/index.js',

// OK

'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-views/data-layer-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/table/head/table-head-item-view.spec.js',

'./lib/assets/core/test/spec/cartodb3/components/context-menu/context-menu-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/dataset/create-context-menu.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-header-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/dataset/dataset-header-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/dataset/dataset-content-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/dataset/dataset-options-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/helpers/error-parser.spec.js',
'./lib/assets/core/test/spec/cartodb3/helpers/mapcard-preview.spec.js',
'./lib/assets/core/test/spec/cartodb3/helpers/magic-positioner.spec.js',
'./lib/assets/core/test/spec/cartodb3/helpers/reset-style-per-node.spec.js',
'./lib/assets/core/test/spec/cartodb3/helpers/utils.spec.js',
'./lib/assets/core/test/spec/cartodb3/locale/en.json.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/analyses.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/asset-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/assets-collection.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/config-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/custom-baselayer-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/custom-baselayers-collection.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/editor-background-polling-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/export-map-definition-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/grantables-collection.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/infowindow-definition-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/layer-colors.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/infowindow-hover-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/layer-types-and-kinds.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/map-definition-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/organization-assets-collection.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/organization-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/permission-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/query-column-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/query-columns-collection.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/query-row-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/query-rows-collection.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/state-definition-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/static-asset-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/synchronization-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/table-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/tables-collection.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/undo-manager.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/upload-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/user-actions.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/user-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/user-notifications.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/vis-definition-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/visualizations-fetch-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/wms-service.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/background-importer/import-model-poller.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/background-importer/import-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/background-importer/imports-collection.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/background-importer/imports-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/legends/legend-bubble-definition-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/legends/legend-custom-choropleth-definition-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/legends/legend-choropleth-definition-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/legends/legend-custom-definition-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/legends/legend-definitions-collection.spec.js',
'./lib/assets/core/test/spec/cartodb3/data/legends/legends-state.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/editor-header.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/editor-map-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/editor-settings-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/editor-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/analyses/analysis-notifications.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/map-operations/rename-map.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/components/toggler/toggler-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/components/undo-redo/undo-redo-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/components/code-mirror/code-mirror-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/components/view-options/panel-with-options-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/components/modals/export-map/modal-export-map-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/widgets/widget-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/widgets/widgets-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/widgets/widgets-form/widgets-form-column-options-factory.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/widgets/widgets-form/widgets-form-content-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/widgets/widgets-form/widgets-form-factory.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/widgets/widgets-form/widgets-form-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/widgets/widgets-form/widgets-header.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/widgets/widgets-form/schema/widget-form-base-schema-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/widgets/widgets-form/schema/widgets-form-category-data-schema-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/widgets/widgets-form/schema/widgets-form-histogram-schema-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/style/style-content-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/style/style-converter-fixtures.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/style/style-converter.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/style/style-definition-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/style/style-manager.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/style/style-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/style/styles-factory.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/style/style-form/style-animated-properties-form-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/style/style-form/style-form-components-dictionary.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/style/style-form/style-form-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/style/style-form/style-labels-properties-form-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/style/style-form/style-properties-form-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/style/style-form/style-shape-properties-form-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/style/style-form/style-aggregation-form/style-aggregation-form.tpl.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/basemap-content-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/edit-feature-content-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-analyses-views.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-analysis-draggable-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-view-factory.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layers-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/notification-error-message-handler.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/analysis-view/analysis-tooltip-error.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/analysis-view/composite-layers-analysis-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/analysis-view/default-layers-analysis-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/analysis-view/ref-layers-analysis-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/analysis-view/source-layers-analysis-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/edit-feature-content-views/edit-feature-action-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/edit-feature-content-views/edit-feature-attributes-form-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/edit-feature-content-views/edit-feature-attributes-form-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/edit-feature-content-views/edit-feature-control-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/edit-feature-content-views/edit-feature-geometry-form-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/edit-feature-content-views/edit-feature-geometry-form-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/edit-feature-content-views/edit-feature-header-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/edit-feature-content-views/edit-feature-inner-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/basemap-content-views/basemap-categories-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/basemap-content-views/basemap-form-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/basemap-content-views/basemap-form-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/basemap-content-views/basemap-header-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/basemap-content-views/basemap-inner-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/basemap-content-views/basemap-model-factory.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/basemap-content-views/basemap-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/basemap-content-views/basemap-select-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/basemap-content-views/basemaps-collection.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-views/background-image-layer-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-views/base-tiled-layer-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-views/labels-layer-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-views/plain-layer-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/sync-info/sync-info-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/layer-content-analyses-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/infowindows/infowindow-content-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/infowindows/infowindow-description-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/infowindows/infowindow-field-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/infowindows/infowindow-fields-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/infowindows/infowindow-form-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/infowindows/infowindow-items-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/infowindows/infowindow-select-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/data/data-content-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/data/data-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/data/stat-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/analyses/analyses-quota-factory.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/analyses/analyses-service.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/analyses/analyses-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/analyses/analyses-workflow-list-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/analyses/analyses-workflow-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/analyses/analysis-controls-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/analyses/analysis-form-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/analyses/analysis-forms-collection.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/analyses/analysis-source-options-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/analyses/analyses-form-models/area-of-influence-form-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/analyses/analyses-form-models/area-of-influence-types.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/analyses/analyses-form-models/base-analysis-form-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/analyses/analyses-form-models/centroid-form-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/analyses/analyses-form-models/connect-with-lines-form-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/analyses/analyses-form-models/data-observatory-measure-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/analyses/analyses-form-models/fallback-form-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/analyses/analyses-form-models/group-points-form-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/analyses/analyses-form-models/merge-form-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/legend/legend-content-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/legend/legend-factory.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/legend/legends-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/legend/form/legend-color-helper.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/legend/form/legend-color-range.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/legend/form/legend-custom-definition-form-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/legend/size/legend-size-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/carousel-form-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/img-loader-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/local-storage.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/mosaic-form-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/popup-manager.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/view-factory.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/background-importer/background-import-item.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/background-importer/background-importer.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/code-mirror/code-mirror-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/custom-carousel/custom-carousel-collection.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/custom-carousel/custom-carousel-item-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/custom-carousel/custom-carousel-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/custom-list/custom-list-collection.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/custom-list/custom-list-item-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/custom-list/custom-list-multi-collection.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/custom-list/custom-list-multi-item-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/custom-list/custom-list-search-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/custom-list/custom-list-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/custom-list/custom-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/error/error-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/infobox/infobox-collection.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/infobox/infobox-factory.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/infobox/infobox-item-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/infobox/infobox-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/inline-editor/inline-editor-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/likes/likes-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/likes/likes-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/metrics/metrics-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/metrics/metrics-tracker.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/mosaic/mosaic-collection.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/mosaic/mosaic-item-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/mosaic/mosaic-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/notifier/notifier-collection.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/notifier/notifier-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/notifier/notifier.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/pagination/pagination-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/pagination/pagination-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/pagination-search-view/pagination-search-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/pagination-search-view/pagination-search-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/privacy-dropdown/privacy-dropdown-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/stack-layout/stack-layout-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/stack-layout/stack-layout-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/tab-pane/create-editor-menu-tab-pane.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/tab-pane/create-mixed-labels-tab-pane.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/tab-pane/create-template-tab-pane.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/tab-pane/create-text-labels-tab-pane.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/tab-pane/tab-pane-collection.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/tab-pane/tab-pane-item-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/tab-pane/tab-pane-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/modal-confirmation-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/modal-view-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/modal-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/modals-service-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-analysis/add-analysis-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-analysis/analysis-info-pane.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-analysis/analysis-option-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-analysis/analysis-options-collection.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-analysis/analysis-options.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-analysis/analysis-view-pane.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-layer/add-layer-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-layer/listing-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-layer/guessing-toggler-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-layer/navigation-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-layer/privacy-toggler-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-layer/shared-for-create-listing-view-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-layer/shared-for-import-view-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/editor-visualization-warning/editor-visualization-warning-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/map-metadata/map-metadata-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/map-metadata/save-metadata-map.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-widgets/add-widgets-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-widgets/body-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-widgets/create-tuples-items.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-widgets/layer-selector-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-widgets/widgets-types.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-basemap/add-basemap-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-basemap/add-basemap-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-basemap/tabs-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-basemap/mapbox/mapbox-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-basemap/mapbox/mapbox-to-tile-layer-factory.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-basemap/mapbox/mapbox-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-basemap/nasa/nasa-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-basemap/nasa/nasa-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-basemap/tilejson/tilejson-layer-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-basemap/tilejson/tilejson-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-basemap/tilejson/tilejson-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-basemap/wms/select-layer-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-basemap/wms/wms-layer-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-basemap/wms/wms-layers-collection.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-basemap/wms/wms-layer-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-basemap/wms/wms-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-basemap/wms/wms-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-basemap/xyz/xyz-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/add-basemap/xyz/xyz-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/publish/privacy-collection.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/publish/publish-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/publish/share-with-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/publish/share/share-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/publish/publish/publish-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/table/table-manager.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/table/table-view-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/table/table-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/table/paginator/table-paginator-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/table/head/table-head-options-item-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/table/head/table-head-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/table/editors/types/editor-date-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/onboardings/builder-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/onboardings/onboarding-view-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/onboardings/onboardings-service-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/onboardings/builder-activated/builder-activated-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/onboardings/generic/generic-onboarding-launcher.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/onboardings/generic/generic-onboarding-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/onboardings/layers/analysis-onboarding/analysis-onboarding-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/onboardings/layers/data-onboarding/data-onboarding-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/onboardings/layers/style-onboarding/style-onboarding-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/field.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/base.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/datetime.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/enabler-editor-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/enabler-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/fill.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/number.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/select-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/suggest-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/taglist-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/operators/operators-list-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/operators/operators-list-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/operators/operators-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/select/multi-select-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/fill/fill-dialog.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/fill/input-color.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/fill/input-number.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/fill/color-picker/color-picker.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/fill/input-number/input-number-content-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/fill/input-number/input-number-value-content-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/fill/input-color/input-color-dialog-content.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/fill/input-color/input-color-file-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/fill/input-color/input-color-fixed-content-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/fill/input-color/input-color-picker-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/fill/input-color/assets-picker/asset-header-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/fill/input-color/assets-picker/user-assets-list-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/fill/input-color/asset-picker/asset-header-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/fill/input-color/asset-picker/assets-list-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/fill/input-color/asset-picker/assets-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/fill/input-color/asset-picker/input-asset-picker-header.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/fill/input-color/asset-picker/input-asset-picker-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/fill/input-color/asset-picker/organization-assets-list-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/fill/input-color/asset-picker/static-asset-item-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/fill/input-color/asset-picker/upload-assets-tab.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/fill/input-color/input-color-picker/input-color-picker-header.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/fill/input-color/input-ramps/input-color-ramps.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/fill/input-color/input-ramps/input-ramp-content-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/fill/input-color/input-ramps/input-ramp-list-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/fill/input-color/input-categories/categories-list/categories-list-item-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/infowindows/infowindow-click-model.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/layers/layer-content-view/infowindows-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/modals/remove-dataset/remove-dataset-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/embed-integrations.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/fill/input-color/input-categories/input-color-categories-list-view.spec.js',
'./lib/assets/core/test/spec/cartodb3/components/form-components/editors/fill/input-color/input-categories/input-color-categories.spec.js',
'./lib/assets/core/test/spec/cartodb3/editor/map-operations/zoom-to-data.spec.js',
'./lib/assets/core/test/spec/cartodb3/deep-insights-integration/legend-manager.spec.js',
'./lib/assets/core/test/spec/cartodb3/deep-insights-integration/edit-feature-overlay.spec.js',
'./lib/assets/core/test/spec/cartodb3/deep-insights-integrations.spec.js'

    ]
  }, 
  output: {
    path: path.resolve(__dirname, '.grunt'),
    filename: '[name].affected-specs.js'
  },
  module: {
    rules: [
      {test: /\.js$/, loader: 'shim-loader', query: webpackShimConfig},
      {
        test: /\.tpl$/,
        use: 'tpl-loader'
      },
      {test: /\.mustache$/, use: 'mustache-loader'}
    ],
    exprContextRegExp: /$^/,
    exprContextCritical: false
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        return module.context && module.context.indexOf('node_modules') !== -1;
      }
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      ['window.jQuery']: 'jquery'
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
      exclude: /vendor/
    })
  ],
  target: 'web',
  node: {
    fs: 'empty'
  }
};

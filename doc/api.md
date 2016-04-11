# API

## cartodb.DI.createDashboard(domObject, vizJson, callback(err, obj))
Creates a new dashboard inside `domObject` based on `vizJson`.

#### Arguments
- domObject: dom object identifier where the dashboard will be inserted
- vizJson: either a vizjson url or a vizjson object. See viz.json spec to see how to generate one
- callback: it will be called when the dashboard is generated. First argument will be null if
  everything was fine, an `Error` object otherwise. Second argument is a `Dashboard` object, see
  below

#### Example
```js
cartodb.deepInsights.createDashboard('#dashboard', vizJSONurl, function(err, dashboard) {
  if (err) {
    console.log('there was an error generating the dashboard');
    return;
  }
  var map = dashboard.getMap()
});
```

## cartodb.DI.Dashboard

##### getMap() -> returns a Map object

##### getWidget(widgetID) -> The widget with the given ID

##### getWidgets() -> List of widgets

##### createCategoryWidget(widgetAttrs) -> CategoryWidget

*example*
```js
var map = dashboard.getMap();
var params = {
  "type": "category",
  "title": "Metro line",
  "type": "aggregation",
  "column": "closest_metro_line",
  "aggregationColumn": "closest_metro_line",
  "aggregation": "count",
};
// adds a category widget using column `test` from the second layer
dashboard.createCategoryWidget(params, map.getLayer(2))
```


##### createHistogramWidget(widgetAttrs, layer) -> HistogramWidget

`widgetAttrs` is an object with the following attributes: 

Mandatory attributes:
- `title`: title shown in the widget
- `bins`: number of histogram bins
- `column`: column to generate the histogram
- `operation`: `count` by default, it could be `avg`

Optional:
- `id`: identifier that will be used when calling `getWidget`
- `order`: order inside the widget list
- `collapsed`: show the wiget collapsed if true
- `show_stats`: show histogram stats
- `normalized`: normalize data seen in the map bounding box with the global dataset histogram 

##### createFormulaWidget(widgetAttrs, layer) -> FormulaWidget

widgetAttrs: `id`, `title`, `order`, `collapsed`, `prefix`, `suffix`, `show_stats`, `description`

##### createTimeSeriesWidget(widgetAttrs, layer) -> TimeSeriesWidget

widgetAttrs: `id`, `title`, `order`, `collapsed`, `bins`, `show_stats`, `normalized`

## cartodb.DI.CategoryWidget

##### update(widgetAttrs) -> Boolean
available attributes: `id`, `title`, `order`, `collapsed`, `prefix`, `suffix`, `show_stats`
returns `true` if the attribute was modified

*example*

```js
var categoryWidget = dashboard.createCategoryWidget(params, map.getLayer(2))
categoryWidget.update({ title: 'testing title' })
```

##### remove()
removes the widget from the dashboard

*example*

```js
var categoryWidget = dashboard.createCategoryWidget(params, map.getLayer(2));
categoryWidget.remove();
```


## cartodb.DI.HistogramWidget

##### update(widgetAttrs) -> Boolean
available attributes: `id`, `title`, `order`, `collapsed`, `bins`, `show_stats`, `normalized`

##### remove()
returns `true` if the attribute was modified


## cartodb.DI.FormulaWidget

##### update(widgetAttrs) -> Boolean
widgetAttrs: `id`, `title`, `order`, `collapsed`, `prefix`, `suffix`, `show_stats`, `description`

##### remove()
returns `true` if the attribute was modified


### cartodb.DI.TimeSeriesWidget

##### update(widgetAttrs) -> Boolean
widgetAttrs: `id`, `title`, `order`, `collapsed`, `bins`, `show_stats`, `normalized`

##### remove()
returns `true` if the attribute was modified

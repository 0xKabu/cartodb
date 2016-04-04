## Deep Insights

This document is a quick start to use CartoDB Deep Insights (DI). It shows how to create dashboards and modify widgets from a JavaScript application.

**Important notice**
This is a beta version, so the API interface might change. We will do our best effort to keep all the changes backwards compatible.

### Using Deep insights library in your application

As this is a WIP library, it will be updated daily with bug fixes, for that reason it is
encouraged to use the CDN version of the library so as we update library your application gets the latests fixes.

```htmlc
<link rel="stylesheet" href="http://libs.cartocdn.com/di.js/v0/themes/css/deep-insights.css" />
<script src=" http://libs.cartocdn.com/di.js/v0/deep-insights.uncompressed.js"></script>
http://libs.cartocdn.com/di.js/v0/deep-insights.uncompressed.js
```


### Create a dashboard

Here's how to create a dashboard:

```js
cartodb.deepInsights.createDashboard('#dashboard', vizJSONurl, function(err, dashboard) {
});
```

## Found a bug?

Please report it in [deep insights repo](https://github.com/CartoDB/deep-insights.js/issues)

## API

### cartodb.DI.createDashboard(domObject, vizJson, callback(err, obj))

Creates a new dashboard inside `domObject` based on `vizJson`.

### cartodb.DI.Dashborbard

This object contains a CartoDB dashboard, a map, and some widgets:

#### getWidgets() -> Array of widgets
#### getWidget(id) -> get widget
#### getMap() -> returns a Map object

#### createCategory-> CategoryWidget

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
dashboard.createCategory(params, map.getLayer(2))
```

#### createHistogram-> HistogramWidget
`id`, `title`, `order`, `collapsed`, `bins`, `show_stats`, `normalized`

#### createFormula-> FormulaWidget
`id`, `title`, `order`, `collapsed`, `prefix`, `suffix`, `show_stats`, `description`

#### createTimeSeries-> TimeSeriesWidget
`id`, `title`, `order`, `collapsed`, `bins`, `show_stats`, `normalized`


### cartodb.DI.CategoryWidget
##### update(opts) -> Boolean
available attributes: `id`, `title`, `order`, `collapsed`, `prefix`, `suffix`, `show_stats`
returns `true` if the attribute was modified

*example*

```js
var cat = dashboard.createCategory(params, map.getLayer(2))
cat.update({ title: 'testing title' })
```

##### remove()
*example*

```js
var cat = dashboard.createCategory(params, map.getLayer(2));
cat.remove();
```

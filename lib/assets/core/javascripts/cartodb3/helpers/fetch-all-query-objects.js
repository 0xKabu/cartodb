/**
 *  Fetch all query objects (querySchemaModel, queryGeometryModel, queryRowsCollection)
 *  if necessary
 */

module.exports = function (params, callback) {
  if (!params) throw new Error('all query objects are required');
  if (!params.querySchemaModel) throw new Error('querySchemaModel is required');
  if (!params.queryGeometryModel) throw new Error('queryGeometryModel is required');
  if (!params.queryRowsCollection) throw new Error('queryRowsCollection is required');

  var allFetched = function () {
    return params.querySchemaModel.isFetched() &&
           params.queryGeometryModel.isFetched() &&
           params.queryRowsCollection.isFetched();
  };

  var allErrored = function () {
    return params.querySchemaModel.hasRepeatedErrors() ||
           params.queryRowsCollection.hasRepeatedErrors() ||
           params.queryGeometryModel.hasRepeatedErrors();
  };

  var checkQueryRowsCollectionFetch = function () {
    if (params.queryRowsCollection.shouldFetch()) {
      var opts = {};
      if (callback) {
        opts.success = callback;
      }
      params.queryRowsCollection.fetch(opts);
    } else {
      // we need to check if all are fetched because shouldFetch include the fetching state
      (allFetched() || allErrored()) && callback && callback();
    }
  };

  var rows = params.queryRowsCollection.size();

  // we need to check if besides queryGeometryModel, there is any row, because the user could have deleted them
  if (params.queryGeometryModel.shouldFetch() || (rows === 0 && params.queryRowsCollection.shouldFetch() && !params.queryGeometryModel.isErrored())) {
    params.queryGeometryModel.fetch();
  }

  if (params.querySchemaModel.shouldFetch()) {
    params.querySchemaModel.fetch({
      success: checkQueryRowsCollectionFetch
    });
  } else {
    checkQueryRowsCollectionFetch();
  }
};

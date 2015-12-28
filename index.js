var builtInMethods = require('./lib/builtInMethods');
var chainFactory = require('./lib/chainFactory');

module.exports = function (baseOptions) {
  if (! (baseOptions.methods || baseOptions.mixins)) throw new Error('options.methods or options.mixins must be provided.');
  var passedMethods = baseOptions.methods;
  var passedMixins = baseOptions.mixins;

  var methods = {};
  var methodSources = {};

  var addMethod = function (name, method, source) {
    if (methods[name]) throw new Error('Method "' + name + '" was provided by "' + methodSources[name] + '" and "' + source + '".');
    methods[name] = method;
    methodSources[name] = source;
  };

  var addMethods = function (methodMap, source) {
    for (var name in methodMap) addMethod(name, methodMap[name], source);
  };

  addMethods(builtInMethods, 'builtInMethods');
  addMethods(passedMethods, 'methods');
  for (var i = 0; i < (passedMixins || []).length; i++) addMethods(passedMixins[i], 'mixin #' + i);

  var Chain = chainFactory(methods);

  // Return a constructor for the chain
  return function (initialResult) { return new Chain({ initialResult: initialResult }); };
};

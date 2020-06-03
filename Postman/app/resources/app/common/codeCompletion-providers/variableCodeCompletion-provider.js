/**
 * Variable Autocomplete provider for Text Editor
 * @param {*} model
 * @param {*} position
 */
export default function variableCodeCompletionProvider (model, position) {
  //  The regex matches with pm sandbox apis like pm.globals.get(' or pm.globals.get('x where x is any character
  // allowed objects are environment|globals|collectionVariables|variables and methods are get|set|unset|has
  let variableRegexString = /pm.(environment|globals|collectionVariables|variables).(((get|set|unset|has)\(('|").*))$/;
  let variableRegex = new RegExp(variableRegexString);

  let word = model.getWordBeforePosition(position);
  let line = model.getLineContent(position.lineNumber);

  if (line) {
    line = line.substring(0, position.column - 1);
  }

  let mappedSuggestions = [];
  let match = variableRegex.exec(line);

  if (!match || match.length < 6) return [];

  let variableType = match[1];

  let activeVariables = this.context.variablesCache.getActiveVariables();
  let filteredVariables = [];

  let scopeMap = {
    'globals': 'global',
    'environment': 'environment',
    'collectionVariables': 'collection'
  };

  if (variableType === 'variables') {
    filteredVariables = _.filter(activeVariables, (variable) => {
      return _.includes(_.toLower(variable.name), word.word);
    });
  } else if (scopeMap[variableType]) {
    let scope = scopeMap[variableType];
    filteredVariables = _.filter(activeVariables, (variable) => {
      return variable.scope === scope && !_.isEqual(variable.type, 'dynamic') && _.includes(_.toLower(variable.name), word.word);
    });
  }

  let insertRange = {
    startLineNumber: position.lineNumber,
    endLineNumber: position.lineNumber,
    startColumn: word.startColumn,
    endColumn: word.endColumn
  };

  mappedSuggestions = filteredVariables.map((item) => {
    let warning = '';
    let overridingVariable = this.context.variablesCache.getOverridingVariable(item),
      shouldOverrideVariable = Boolean(overridingVariable);

    if (shouldOverrideVariable) {
      warning = `This variable exists in both ${overridingVariable.scope} and ${item.scope} scopes. ${_.capitalize(overridingVariable.scope)} variables overwrite ${item.scope} variables.`;
    }

    // if the suggestion item is a dynamic variable only show the details and scope
    if (_.isEqual(item.type, 'dynamic')) {
      return {
        label: item.name,
        detail: `Details: ${_.toString(item.value)}`,
        documentation: `Scope: ${_.capitalize(item.scope)}\n\n${warning}`,
        insertText: item.name,
        range: insertRange
      };
    } else {
      return {
        label: item.name,
        detail: `Current: ${item.sessionValue}`,
        documentation: `Initial: ${_.toString(item.value)} \nScope: ${_.capitalize(item.scope)}\n\n${warning}`,
        insertText: item.name,
        range: insertRange
      };
    }
  });

  return mappedSuggestions;
}

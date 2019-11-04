//
// Configuration file for the i18next-parser which extracts the strings to be translated
// from our code and places them in the `${language}/translation.json` files in this directory.
//
module.exports = {
  // Key separator used in your translation keys
  contextSeparator: '_',

  // Save the \_old files
  createOldCatalogs: true,

  // Default namespace used in your i18next config
  defaultNamespace: 'translation',

  // Default value to give to empty keys
  defaultValue: '',

  // Indentation of the catalog files
  indentation: 2,

  // Keep keys from the catalog that are no longer in code
  keepRemoved: false,

  // Key separator used in your translation keys
  // If you want to use plain english keys, separators such as `.` and `:` will conflict. You might want to set `keySeparator: false` and `namespaceSeparator: false`. That way, `t('Status: Loading...')` will not think that there are a namespace and three separator dots for instance.
  // keySeparator: '.',
  keySeparator: false,

  // map file extensions to lexers
  lexers: {
    default: ['JavascriptLexer'],

    hbs: ['HandlebarsLexer'],
    handlebars: ['HandlebarsLexer'],

    htm: ['HTMLLexer'],
    html: ['HTMLLexer'],

    js: ['JavascriptLexer'], // if you're writing jsx inside .js files, change this to JsxLexer
    jsx: ['JsxLexer'],
    mjs: ['JavascriptLexer'],

    ts: ['TypescriptLexer'],
    tsx: ['TypescriptLexer'],
  },

  // Control the line ending. See options at https://github.com/ryanve/eol
  lineEnding: 'auto',

  // An array of the locales in your applications
  locales: ['de', 'en', 'es', 'fr', 'zh'],

  // Namespace separator used in your translation keys
  // If you want to use plain english keys, separators such as `.` and `:` will conflict. You might want to set `keySeparator: false` and `namespaceSeparator: false`. That way, `t('Status: Loading...')` will not think that there are a namespace and three separator dots for instance.
  // namespaceSeparator: ':',
  namespaceSeparator: false,

  // Supports $LOCALE and $NAMESPACE injection
  // Supports JSON (.json) and YAML (.yml) file formats
  // Where to write the locale files relative to process.cwd()
  output: 'src/core/l10n/$LOCALE/$NAMESPACE.json',

  // An array of globs that describe where to look for source files
  // relative to the location of the configuration file, or rely on the command line.
  input: undefined,

  // For react file, extract the defaultNamespace - https://react.i18next.com/components/translate-hoc.html
  // Ignored when parsing a `.jsx` file and namespace is extracted from that file.
  reactNamespace: false,

  // Whether or not to sort the catalog
  sort: true,

  // Whether to use the keys as the default value; ex. "Hello": "Hello", "World": "World"
  // The option `defaultValue` will not work if this is set to true
  // `true` does not seem to work....
  useKeysAsDefaultValue: false,

  // Display info about the parsing including some stats
  // namely: added keys, restored keys, removed keys
  verbose: false,
}

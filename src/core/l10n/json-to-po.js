//
// Take all ${language}/translation.json files and convert them to `.po` files.
// Assumption: each 2 letter directory here represents a language to translate.
//
// const {
//   readdirSync,
//   readFileSync,
//   writeFileSync,
// } = require('fs')
// const {
//   i18nextToPo,
//   // i18nextToPot,
//   // i18nextToMo,
//   // gettextToI18next,
// } = require('i18next-conv')
// const path = require('path')
//
// const L10N_DIR = path.resolve(path.join(__dirname))
//
// const options = {/* see https://github.com/i18next/i18next-gettext-converter */}
//
// console.log('Converting .json files to .po files for each found language.')
//
// Promise.all(
//   readdirSync(L10N_DIR, {withFileTypes: true})
//     .filter(dirent => dirent.isDirectory())
//     .map(dirent => dirent.name)
//     .map((language) => {
//       console.log(`converting ${language}/translation.json to ${language}/translation.po`)
//       return i18nextToPo(language, readFileSync(path.join(L10N_DIR, language, `translation.json`)), options)
//         .then((result) => writeFileSync(path.join(L10N_DIR, language, 'translation.po'), result))
//     })
// ).then(() => console.log('Done.'))
//   .catch((err) => console.error('Something bad happened:', err))

// i18nextToPo('ua-UK', readFileSync(source), options).then(save('../locales/ua-UK/translation.po'))

throw new Error('fixme: I need to be made to work with the data located in the data sources')

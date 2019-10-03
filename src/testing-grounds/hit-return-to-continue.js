import {prompt} from 'enquirer'
import {t} from 'l10n'

/**
 * Pause prompt, most useful for making sure the user has time to read the
 * current text output.
 *
 * @param {String} [message]
 * @return {Promise}
 */
export const hitReturnToContinue = async (message = t('Hit return to continue')) => {
  await prompt({
    type: 'input',
    message,
  })
}

export default hitReturnToContinue

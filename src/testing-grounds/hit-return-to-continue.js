import {prompt} from 'enquirer'

/**
 * Pause prompt, most useful for making sure the user has time to read the
 * current text output.
 *
 * @param {String} [message]
 * @return {Promise}
 */
export const hitReturnToContinue = async (message = 'Hit return to continue.') => {
  await prompt({
    type: 'input',
    message,
  })
}

export default hitReturnToContinue

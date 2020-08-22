import * as dataSourceGame from 'meat-grinder/data-source-game'
import hitReturnToContinue from 'hit-return-to-continue'
import _ from 'lodash'
import out from 'out'
import * as sceneChoices from './scene-choices'
import * as simulation from 'simulation'
import * as wrappers from './wrappers'
import * as ui from 'ui'

/**
 * You find a new equippable.
 *
 * @return {NextScene}
 */
export const scene = async ({terrain, turn}) => {
  const artifact = simulation.createRandom({type: 'equippable'})

  out.t('{{artifact}} lies on the ground.', {artifact: ui.text.naming.short(artifact)})
  out.t('Eldritch tendrils wrap around and snap the artifact into the pocket storage dimension.')
  out.t('Next stop: Vault-o-matic.')

  dataSourceGame.vaultEquippables.add(artifact)
  dataSourceGame.vaultEquippables.write()

  hitReturnToContinue()

  // Deal with the equpiment in a single scene, not scattered throughout the code base...
  // ...at least for now while I don't have reusable code for equipment management.
  return sceneChoices.vaultEquippables()
}

export default _.flowRight([
  wrappers.throwIfNoEmpire,
  wrappers.throwIfNoArmyGroup,
  wrappers.uiWhiteSpace,
  wrappers.uiGameTurn,
  wrappers.uiTerrain,
])(scene)

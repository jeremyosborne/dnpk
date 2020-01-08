import * as perlinModule from './perlin'

// Singleton access for those that just want to use this.
export const perlin = perlinModule.create()

// Full module export for those that need an individualized instance.
export const modules = {
  perlin: perlinModule
}

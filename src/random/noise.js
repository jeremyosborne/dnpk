// I oringally found this code at:
//
//     http://freespace.virgin.net/hugo.elias/models/m_perlin.htm
//
// And some other code at:
//
//     http://mrl.nyu.edu/~perlin/doc/oscar.html
//     http://www.noisemachine.com/talk1
//     http://webstaff.itn.liu.se/~stegu/TNM022-2005/perlinnoiselinks/perlin-noise-math-faq.html
//
// Most of the websites are gone, other than `~perlin`. Copying my long ago python
// code and morphing it into JavaScript.
//

import _ from 'lodash'

export const noise = (x, y) => {
  let n = x + y * 57
  n = (n << 13) ^ n
  return 1.0 - ((n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0
}

export const smoothedNoise = (x, y) => {
  const corners = (noise(x - 1, y - 1) + noise(x + 1, y - 1) + noise(x - 1, y + 1) + noise(x + 1, y + 1)) / 16
  const sides = (noise(x - 1, y) + noise(x + 1, y) + noise(x, y - 1) + noise(x, y + 1)) / 12
  const center = noise(x, y) / 8
  return corners + sides + center
}

export const interpolate = (a, b, x) => {
  const ft = x * Math.PI
  const f = (1 - Math.cos(ft)) * 0.5
  return a * (1 - f) + b * f
}

export const interpolatedNoise = (x, y) => {
  const integerX = parseInt(x, 10)
  const fractionalX = x - integerX

  const integerY = parseInt(y, 10)
  const fractionalY = y - integerY

  const v1 = smoothedNoise(integerX, integerY)
  const v2 = smoothedNoise(integerX + 1, integerY)
  const v3 = smoothedNoise(integerX, integerY + 1)
  const v4 = smoothedNoise(integerX + 1, integerY + 1)

  const i1 = interpolate(v1, v2, fractionalX)
  const i2 = interpolate(v3, v4, fractionalX)
  return interpolate(i1, i2, fractionalY)
}

export const noisePerlin = ({x, y, octaves = 3, persistence = 0.01}) => {
  let total = 0

  _.times(octaves, (i) => {
    const frequency = Math.pow(2, i)
    const amplitude = Math.pow(persistence, i)

    total += interpolatedNoise(x * frequency, y * frequency) * amplitude
  })

  return total
}

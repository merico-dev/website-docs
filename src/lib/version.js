import data from '../../docs.json'

const docs = data['docs']

/**
 * Convert version to custom name.
 *
 * Copy from create-pages/renameVersion.
 *
 * @param {string} version
 * @param {string} stable
 * @return {string}
 */
export function convertVersionName(version, stable) {
  switch (version) {
    case 'master':
      return 'dev'
    case stable:
      return 'stable'
    default:
      return version.replace('release-', 'v')
  }
}

export const eeStable = docs['ee']['stable']
export const tidbStable = docs['tidb']['stable']

export const ee = docs['ee']['languages']['zh']['versions'].map(d =>
  convertVersionName(d, eeStable)
)
export const tidb = docs['tidb']['languages']['en']['versions'].map(d =>
  convertVersionName(d, tidbStable)
)

export const deprecated = {
  ee: docs['ee']['deprecated'],
  tidb: docs['tidb']['deprecated'],
}

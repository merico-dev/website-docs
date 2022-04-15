import { getContent, http } from './http.js'
import stream, { pipeline } from 'stream'

import fs from 'fs'
import path from 'path'
import sig from 'signale'

const IMAGE_CDN_PREFIX = 'https://merico.cn/images'
export const imageCDNs = {
  docs: IMAGE_CDN_PREFIX + '/docs',
  'docs-cn': IMAGE_CDN_PREFIX + '/docs-cn',
}

/**
 * Retrieve all MDs recursively.
 *
 * @export
 * @param {Object} metaInfo
 * @param {string} metaInfo.repo - Short for owner/repo
 * @param {string} metaInfo.path - Subpath to the repository
 * @param {string} metaInfo.ref - which branch
 * @param {string} destDir - destination
 * @param {Object} [options]
 * @param {string[]} [options.ignore] - Specify the files to be ignored
 * @param {Array} [options.pipelines]
 */
export async function retrieveAllMDs(metaInfo, destDir, options) {
  const { repo, ref, path = '' } = metaInfo
  const { ignore = [], pipelines = [] } = options

  const data = (await getContent(repo, ref, path)).data

  if (Array.isArray(data)) {
    data.forEach(d => {
      const { type, name, download_url } = d
      const nextDest = `${destDir}/${name}`

      if (ignore.includes(name)) {
        return
      }

      if (type === 'dir') {
        retrieveAllMDs(
          {
            repo,
            ref,
            path: `${path}/${name}`,
          },
          nextDest,
          options
        )
      } else {
        if (name.endsWith('.md')) {
          writeContent(download_url, nextDest, pipelines)
        }
      }
    })
  } else {
    if (data.name.endsWith('.md')) {
      writeContent(
        data.download_url,
        destDir.endsWith('.md') ? destDir : `${destDir}/${data.name}`,
        pipelines
      )
    }
  }
}

/**
 * Generate destination. If a path is provided, special handling will be performed.
 *
 * @export
 * @param {string} repo
 * @param {string} path
 * @param {string} destDir
 */
export function genDest(repo, path, destDir, sync) {
  return path ? `${destDir}/${path}` : destDir
}

/**
 * Write content through streams.
 *
 * @export
 * @param {string} url
 * @param {fs.PathLike} destPath
 * @param {Array} [pipelines=[]]
 */
export async function writeContent(download_url, destPath, pipelines = []) {
  const dir = path.dirname(destPath)

  if (!fs.existsSync(dir)) {
    sig.info(`Create empty dir: ${dir}`)
    fs.mkdirSync(dir, { recursive: true })
  }

  const res = await http.get(download_url)
  const readableStream = stream.Readable.from(res.data)
  const writeStream = fs.createWriteStream(destPath)
  writeStream.on('close', () => sig.success('Downloaded:', download_url))

  pipeline(readableStream, ...pipelines.map(p => p()), writeStream, err => {
    if (err) {
      sig.error('Pipeline failed:', err)
    }
  })
}

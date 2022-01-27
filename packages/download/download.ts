import { genDest, imageCDNs, retrieveAllMDs } from './utils.js'
import {
  replaceCopyableStream,
  replaceImagePathStream,
  replaceTabsPanelStream,
} from '@pingcap/docs-content'

import { execSync } from 'child_process'
import fs from 'fs'
import { genContentFromOutline } from './gen.js'
import { handleSync } from './sync.js'
import nPath from 'path'
import rimraf from 'rimraf'
import sig from 'signale'

function genOptions(repo: string, config, dryRun: boolean) {
  const options = {
    pipelines: [
      () => replaceImagePathStream(imageCDNs[repo.split('/')[1]]),
      replaceCopyableStream,
      replaceTabsPanelStream,
    ],
    dryRun,
  }

  if (config) {
    let contents
    try {
      contents = fs.readFileSync(config)
    } catch (err) {
      return options
    }

    options.ignore = JSON.parse(contents).ignore
  }

  return options
}

export function download(argv) {
  const { repo, path, ref, destination, config, dryRun } = argv
  const dest = nPath.resolve(destination)
  const options = genOptions(repo, config, dryRun)

  switch (repo) {
    case 'pingcap/docs':
    case 'pingcap/docs-cn':
      retrieveAllMDs(
        {
          repo,
          path,
          ref,
        },
        genDest(
          repo,
          path,
          nPath.resolve(
            dest,
            `${repo.endsWith('-cn') ? 'zh' : 'en'}/tidb/${ref}`
          )
        ),
        options
      )

      break
    case 'merico-dev/docs-en':
    case 'merico-dev/docs-cn':
      retrieveAllMDs(
        {
          repo,
          path,
          ref,
        },
        genDest(
          repo,
          path,
          nPath.resolve(
            dest,
            `${repo.endsWith('-cn') ? 'zh' : 'en'}/ee/${ref}`
          )
        ),
        options
      )

      break
  }
}

export const clean = rimraf

export function sync(argv) {
  const { repo, ref, base, head, destination, config, dryRun } = argv
  const dest = nPath.resolve(destination)
  const options = genOptions(repo, config, dryRun)

  switch (repo) {
    case 'pingcap/docs':
    case 'pingcap/docs-cn':
      handleSync(
        {
          repo,
          ref,
          base,
          head,
        },
        nPath.resolve(
          dest,
          `${repo.endsWith('-cn') ? 'zh' : 'en'}/tidb/${ref}`
        ),
        options
      )

      break
    case 'merico-dev/docs-en':
    case 'merico-dev/docs-cn':
      handleSync(
        {
          repo,
          ref,
          base,
          head,
        },
        nPath.resolve(
          dest,
          `${repo.endsWith('-cn') ? 'zh' : 'en'}/ee/${ref}`
        ),
        options
      )

      break
  }
}

export function gen(argv) {
  const { repo, ref, from, output } = argv
  const repoDest = `${nPath.dirname(from)}/${repo}`

  if (!fs.existsSync(repoDest)) {
    sig.start('Clone', repoDest, '...')

    execSync(
      `git clone https://github.com/${repo}.git ${repoDest} --branch ${ref} --depth 1`
    )
  }

  genContentFromOutline(repo, from, output)
}

import fs from 'fs'
import * as path from 'path'
import glob from 'glob'
import extractTypings from './src/extractTypings'

export interface Config {
  cwdDir: string
  outputDir: string
  match: string
  interfaces?: {
    ignore?: (string | RegExp)[]
  }
}

// const config: Config = {
//   cwdDir: './models',
//   outputDir: './typings/core',
//   match: '*',
//   interfaces: {
//     ignore: [
//       /Payload$/,
//     ],
//   },
// }

function extract(config: Config) {
  glob(config.match, { cwd: config.cwdDir }, (err, files) => {
    if (err) {
      console.error(err)
      return null
    }
    console.log('files', files)

    const fileResultPath = path.join(config.outputDir, 'index.d.ts')
    fs.mkdirSync(config.outputDir, { recursive: true })
    fs.writeFileSync(fileResultPath, '', { encoding: 'utf8' })

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      console.log(`[${i + 1}/${files.length}]`, 'process', file)
      processFile(file, {
        fileResultPath,
      })
    }
  })

  function processFile(filePath: string, { fileResultPath }: { fileResultPath: string}) {
    const resultTypings = extractTypings(filePath, config)
    console.log('--- ts --- ')
    console.log(resultTypings)
    if (!resultTypings) {
      console.error('resultTypings is null. Skip')
      return null
    }

    const relativeFilePath = filePath
    let newFilePath = path.join(config.outputDir, relativeFilePath)
    newFilePath = newFilePath.replace(/.ts$/, '.d.ts')
    console.log('newFilePath', newFilePath)
    const typingsTitle = `\n/**********   ${relativeFilePath}    **********/\n`
    fs.appendFileSync(fileResultPath, typingsTitle + resultTypings, { encoding: 'utf8' })
  }
}

export default {
  extract,
}

import fs from 'fs'
import * as path from 'path'
import glob from 'glob'
import minimatch from 'minimatch'
import extractTypings from './extractTypings'

const config = {
  rootDir: './models',
  outputDir: './typings/core',
  match: './models/*',
  interfaces: {
    ignore: [
      /Payload$/,
    ],
  },
}

// const a = minimatch('.', config.match)
glob(config.match, (err, files) => {
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
// console.log('a', a)

function processFile(filePath: string, { fileResultPath }: { fileResultPath: string}) {
  const resultTypings = extractTypings(filePath, config)
  console.log('--- ts --- ')
  console.log(resultTypings)
  if (!resultTypings) {
    console.error('resultTypings is null. Skip')
    return null
  }
  // files is an array of filenames.
  // If the `nonull` option is set, and nothing
  // was found, then files is ["**/*.js"]
  // er is an error object or null.
  const relativeFilePath = filePath.replace(config.rootDir, '')
  let newFilePath = path.join(config.outputDir, relativeFilePath)
  newFilePath = newFilePath.replace(/.ts$/, '.d.ts')
  console.log('newFilePath', newFilePath)
  const typingsTitle = `\n/**********   ${relativeFilePath}    **********/\n`
  fs.appendFileSync(fileResultPath, typingsTitle + resultTypings, { encoding: 'utf8' })
}

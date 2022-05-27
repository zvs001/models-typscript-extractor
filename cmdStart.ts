import path from 'path'
import invariant from 'invariant'
import _ from 'lodash'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import extractor from './index'

function getArgs() {
  return yargs(hideBin(process.argv))
    .option('cwdDir', {
      alias: 'cwd',
      type: 'string',
      description: 'Rood Directory',
    })
    .option('config', {
      alias: 'c',
      type: 'string',
      description: 'Configuration for extracting types',
    })
    .demandOption(['config'], 'Please provide --config for extracting types')
    .exitProcess(false)
    .argv
}

const cmdStart = () => {
  const args = getArgs()
  const { config: configPath } = args

  const absolutePath = path.join(process.cwd(), configPath)

  const configFileData = require(absolutePath)
  const config = configFileData.default || configFileData
  invariant(_.isPlainObject(config) && !_.isEmpty(config), 'Config file is not valid!')

  return extractor.extract(config)
}

cmdStart()

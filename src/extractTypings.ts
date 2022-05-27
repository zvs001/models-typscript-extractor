import path from 'path'
import _ from 'lodash'
import * as ts from 'typescript'
import { Config } from '../index'

function extractTypings(file: string, config: Config): string | null {
  // Create a Program to represent the project, then pull out the
  // source file to parse its AST.
  const filePath = path.join(config.cwdDir, file)
  const program = ts.createProgram([filePath], { allowJs: true })
  const sourceFile = program.getSourceFile(filePath)
  if (!sourceFile) return null

  // To print the AST, we'll use TypeScript's printer
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })

  // To give constructive error messages, keep track of found and un-found identifiers
  const resultNodes = filterNodes(sourceFile, config)
  if (_.isEmpty(resultNodes)) return null

  const resultFile = ts.createSourceFile('./tttt11.ts', '', ts.ScriptTarget.Latest, /* setParentNodes */ false, ts.ScriptKind.TS)

  const output = resultNodes.map(node => printer.printNode(ts.EmitHint.Unspecified, node, resultFile)).join('\n').trim()

  return output
}

function filterNodes(sourceFile: ts.SourceFile, { cwdDir, interfaces }: Config): ts.Node[] {
  const resultNodes: ts.Node[] = []
  ts.forEachChild(sourceFile, node => {
    let name = ''

    // This is an incomplete set of AST nodes which could have a top level identifier
    // it's left to you to expand this list, which you can do by using
    // https://ts-ast-viewer.com/ to see the AST of a file then use the same patterns
    // as below
    if (ts.isFunctionDeclaration(node)) {
      return null
      console.log('isFunctionDeclaration')
      name = node.name.text
      // Hide the method body when printing
      node.body = undefined
    } if (ts.isVariableStatement(node)) {
      return null

      console.log('isVariableStatement')

      name = node.declarationList.declarations[0].name.getText(sourceFile)
    } if (ts.isInterfaceDeclaration(node)) {
      name = node.name.text
      const { ignore } = interfaces || {}
      let isIgnored = false
      _.forEach(ignore, regex => {
        if (name.match(regex)) isIgnored = true
      })

      if (isIgnored) return null
      console.log('isInterfaceDeclaration')
    } else if (ts.isTypeAliasDeclaration(node)) {
      console.log('isTypeParameterDeclaration')
      name = node.name.text
    } else if (ts.isImportDeclaration(node)) {
      console.log('isImportDeclaration')

      name = node.moduleSpecifier.text
      if (name.includes('..')) {
        /** @note: Filter imports outside typing directory. */
        // const rootDirPath = path.resolve(rootDir)
        const importPath = name
        const filePath = sourceFile.path
        const fileDir = path.dirname(filePath)
        const libFullPath = path.resolve(fileDir, importPath)
        if (!libFullPath.includes(cwdDir)) {
          return null
        }
      } else {
        // module import
        return null
      }
    } else if (ts.isExportAssignment(node)) {
      return null
    } else if (ts.isExportSpecifier(node)) {
      // console.log('isExportSpecifier')
    }

    console.log('name', name)
    if (!node || !name) return null
    resultNodes.push(node)
  })

  return resultNodes
}

export default extractTypings

import fs from 'fs'
import yaml from 'js-yaml'
import path from 'path'

const configPath = path.resolve(__dirname, '../config/config.yaml')

export function checkConfigFile() {
  if (!fs.existsSync(path.resolve(__dirname, '../config'))) {
    fs.mkdirSync(path.resolve(__dirname, '../config'))
  }

  if (!fs.existsSync(configPath)) {
    fs.copyFileSync(path.resolve(__dirname, '../template/config.yaml'), configPath)
  }
}

export function getConfig(): any {
  try {
    // Synchronicity used only for the example (it stops the Event Loop).
    const data = fs.readFileSync(configPath, 'utf8')
    const parsedData = yaml.load(data)
    // console.log(parsedData)
    return parsedData
  } catch (e) {
    console.log(e)
  }
}

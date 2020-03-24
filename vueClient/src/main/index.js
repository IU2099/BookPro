import path from 'path'
import { app, dialog } from 'electron'
import App from './app'
import cli from './cli'
import Accessor from './app/accessor'
import setupEnvironment from './app/env'




const args = cli()
const appEnvironment = setupEnvironment(args)

let accessor = null
try {
  accessor = new Accessor(appEnvironment)
} catch (err) {
  // Catch errors that may come from invalid configuration files like settings.
  const msgHint = err.message.includes('Config schema violation')
    ? 'This seems to be an issue with your configuration file(s). ' : ''
  log.error(`Loading Mark Text failed during initialization! ${msgHint}`, err)

  const EXIT_ON_ERROR = !!process.env.MARKTEXT_EXIT_ON_ERROR
  const SHOW_ERROR_DIALOG = !process.env.MARKTEXT_ERROR_INTERACTION
  if (!EXIT_ON_ERROR && SHOW_ERROR_DIALOG) {
    dialog.showErrorBox(
      'There was an error during loading',
      `${msgHint}${err.message}\n\n${err.stack}`
    )
  }
  process.exit(1)
}




const marktext = new App(accessor, args)
marktext.init()
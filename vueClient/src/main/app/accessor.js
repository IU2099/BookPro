// import Preference from '../preferences'
// import DataCenter from '../dataCenter'
// import Keybindings from '../keyboard/shortcutHandler'
// import AppMenu from '../menu'
// import WindowManager from '../app/windowManager'

class Accessor {
  /**
   * @param {AppEnvironment} appEnvironment  应用程序环境实例.
   */
  constructor(appEnvironment) {
    const userDataPath = appEnvironment.paths.userDataPath

    this.env = appEnvironment
    this.paths = appEnvironment.paths // export paths to make it better accessible
    // this.preferences = new Preference(this.paths)
    // this.dataCenter = new DataCenter(this.paths)
    // this.keybindings = new Keybindings(userDataPath)
    // this.menu = new AppMenu(this.preferences, this.keybindings, userDataPath)
    // this.windowManager = new WindowManager(this.menu, this.preferences)
  }
}

export default Accessor

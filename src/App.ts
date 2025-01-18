import express, { Application as ExApplication } from 'express'
import healthcheck from './handlers/healthcheck'

class App {
  private readonly _instance: ExApplication

  /**
   * @constructs App
   */
  constructor() {
    this._instance = express()
    this._instance.use(express.json())
    this.registerRouters()
  }

  /**
   * @get instance
   */
  get instance(): ExApplication {
    return this._instance
  }

  /**
   * registerRouters
   * @inner
   */
  private registerRouters() {
    this._instance.use('/api/v1/healthcheck', healthcheck)
  }
}

export default new App()

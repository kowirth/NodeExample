import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({
  path: process.env.APP_ENV
    ? path.resolve(`.env.${process.env.APP_ENV}`)
    : path.resolve('.env'),
  override: true,
})

// any configuration or initialization variables

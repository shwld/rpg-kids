import Sentry from 'sentry-expo'
import env from './env'

Sentry.config(env.sentyConfig.dsn).install()

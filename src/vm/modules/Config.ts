export class Config {
  static vars: Record<string, string> = {}

  static async get(key: string) {
    return Config.vars[key]
  }

  static async keys() {
    return Object.keys(Config.vars)
  }

  static async values() {
    return Object.values(Config.vars)
  }
}

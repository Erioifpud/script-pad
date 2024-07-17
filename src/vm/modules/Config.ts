export class Config {
  private vars: Record<string, string> = {}

  constructor(vars: Record<string, string>) {
    this.vars = vars
  }

  async get(key: string) {
    return this.vars[key]
  }

  async keys() {
    return Object.keys(this.vars)
  }

  async values() {
    return Object.values(this.vars)
  }
}

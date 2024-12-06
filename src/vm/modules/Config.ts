export class Config {
  private vars: Record<string, string> = {}

  constructor(vars: Record<string, string>) {
    this.vars = vars
  }

  get(key: string) {
    return this.vars[key]
  }

  keys() {
    return Object.keys(this.vars)
  }

  values() {
    return Object.values(this.vars)
  }
}

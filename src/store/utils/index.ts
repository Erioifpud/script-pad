export const randomUUID = () => {
  return self.crypto.randomUUID()
}

export const emptyUUID = () => {
  return '00000000-0000-0000-0000-000000000000'
}
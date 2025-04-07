export function setToken(token: string, type: number) {
  localStorage.setItem('token:type', `${type}`)
  localStorage.setItem('token:string', token)
}

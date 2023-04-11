export function getTime () {
  return (new Date()).toISOString().substring(11, 19)
}

let number = 1
export function getCount () {
  return number++
}

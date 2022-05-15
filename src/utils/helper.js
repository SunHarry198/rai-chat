export const isEmail = value =>
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    value
  )

export const generateNameId = ({ name, _id }) =>
  encodeURIComponent(`${name.replace(/\s/g, '-').replace(/%/g, '')}-i.${_id}`)

export const getIdFromNameId = url => {
  const arr = url.split('-i.')
  return arr[arr.length - 1]
}

export const rateSale = (original, sale) =>
  Math.round(((original - sale) / original) * 100) + '%'

export const formatMoney = (value, character = '.') =>
  String(value).replace(/\B(?=(\d{3})+(?!\d))/g, character)

export const formatK = value => {
  const price = Number((Number(value) / 1000).toFixed(2))
  if (price > 1) {
    return price + 'k'
  }
  return value
}

export const ObjectToArray = object => {
  let array = []
  Object.keys(object).forEach(key => {
    array = [...array, { id: key, chat: object[key] }]
  })
  let sortArray = [...array].sort((a, b) => a.value?.number - b.value?.number)
  return [...sortArray]
}

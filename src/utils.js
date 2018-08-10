function timeDifference(current, previous) {
  const milliSecondsPerMinute = 60 * 1000
  const milliSecondsPerHour = milliSecondsPerMinute * 60
  const milliSecondsPerDay = milliSecondsPerHour * 24
  const milliSecondsPerMonth = milliSecondsPerDay * 30
  const milliSecondsPerYear = milliSecondsPerDay * 365

  const elapsed = current - previous

  if (elapsed < milliSecondsPerMinute / 3) {
    return 'just now'
  }

  if (elapsed < milliSecondsPerMinute) {
    return 'less than 1 min ago'
  }

  else if (elapsed < milliSecondsPerHour) {
    return Math.round(elapsed/milliSecondsPerMinute) + ' min ago'
  }

  else if (elapsed < milliSecondsPerDay ) {
    return Math.round(elapsed/milliSecondsPerHour ) + ' h ago'
  }

  else if (elapsed < milliSecondsPerMonth) {
    return Math.round(elapsed/milliSecondsPerDay) + ' days ago'
  }

  else if (elapsed < milliSecondsPerYear) {
    return Math.round(elapsed/milliSecondsPerMonth) + ' mo ago'
  }

  else {
    return Math.round(elapsed/milliSecondsPerYear ) + ' years ago'
  }
}

export function timeDifferenceForDate(date) {
  const now = new Date().getTime()
  const updated = new Date(date).getTime()
  return timeDifference(now, updated)
}

export function isNil(value) {
  return value === null || value === undefined
}

export function isEmpty(value) {
  return value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && !Object.keys(value).length === 0)
}

export function isObject(value) {
  if (value === null) { return false }
  return ((typeof value === 'function') || (typeof value === 'object'))
}

export function get(object = {}, path = "", defaultValue) {
  if (!isObject(object) || typeof path !== 'string') {
    return defaultValue
  }
  const properties = path.split(".")
  let head = object
  for (let i = 0; i < properties.length; i++) {
    const property = properties[i]
    if (i === properties.length - 1 &&
      isObject(head)) {
      if (isNil(head[property])) { return defaultValue }
      return head[property]
    } else if (!isObject(head)) {
      return defaultValue
    } else {
      head = head[property]
    }
  }
}

export function nullOr(value) {
  if (value === undefined) { return null }
  return value
}

export function nullString(str = "") {
  return str === null
    ? null
    : str.trim() === "" ? null
    : str
}

export function debounce(func, delay) {
  let inDebounce
  return function() {
    const context = this
    const args = arguments
    clearTimeout(inDebounce)
    inDebounce = setTimeout(() => func.apply(context, args), delay)
  }
}

export function groupBy(array = [], field = "") {
  return array.reduce(
    (r, v, i, a, k = get(v, field, "")) => {
      (r[k] || (r[k] = [])).push(v)
      return r
    },
    {},
  )
}

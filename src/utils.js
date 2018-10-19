import * as React from 'react'

export function byteSizeToString(size) {
  const bytesPerKB = 1000
  const bytesPerMB = bytesPerKB * 1000
  const bytesPerGB = bytesPerMB * 1000

  if (size < bytesPerKB) {
    return size + ' B'
  }
  else if (size < bytesPerMB) {
    return size/bytesPerKB + ' KB'
  }
  else if (size < bytesPerGB) {
    return size/bytesPerMB + ' MB'
  }
  else {
    return size/bytesPerGB + ' GB'
  }
}

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
  if (typeof str !== 'string') {
    return null
  }
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

export function throttle(func, limit) {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
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

export function recursiveReactChildrenMap(children, f) {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child
    }

    if (child.props.children) {
      child = React.cloneElement(child, {
        children: recursiveReactChildrenMap(child.props.children, f)
      })
    }

    return f(child)
  })
}

export function makeCancelable (promise) {
  let hasCanceled_ = false

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      val => hasCanceled_ ? reject({isCanceled: true}) : resolve(val),
      error => hasCanceled_ ? reject({isCanceled: true}) : reject(error)
    )
  })

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true
    },
  }
}

export function moveListItem(list, startIndex, endIndex) {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

function escapeRegExp(str) {
  return str.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
}

export function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

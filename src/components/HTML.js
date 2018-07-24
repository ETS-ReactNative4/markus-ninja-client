import * as React from 'react'
import convert from 'htmr'
import { get } from 'utils'

const HTML = props => <div {...props}>{convert(get(props, "html", ""))}</div>

export default HTML

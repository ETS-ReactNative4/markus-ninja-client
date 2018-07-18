import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { get } from 'utils'

class ViewerEmail extends Component {
  render() {
    const email = get(this.props, "email", {})
    return (
      <div className="ViewerEmail">
        {email.value}
        <span className="ViewerEmail__type">{email.type}</span>
      </div>
    )
  }
}

export default createFragmentContainer(ViewerEmail, graphql`
  fragment ViewerEmail_email on Email {
    id
    type
    value
  }
`)

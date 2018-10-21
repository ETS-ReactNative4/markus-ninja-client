import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import Icon from 'components/Icon'
import { get } from 'utils'

class ViewerEmail extends Component {
  render() {
    const email = get(this.props, "email", {})
    return (
      <li className="ViewerEmail mdc-list-item">
        <Icon as="span" className="mdc-list-item__graphic" icon="email" />
        <div className="mdc-list-item__text">
          {email.value}
        </div>
        <div className="mdc-list-item__meta">
          <span className="mdc-button mdc-button--outlined ml2">{email.type}</span>
        </div>
      </li>
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

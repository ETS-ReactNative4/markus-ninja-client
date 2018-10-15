import * as React from 'react'
import cls from 'classnames'
import moment from 'moment'
import {Link} from 'react-router-dom'
import Icon from 'components/Icon'
import EnrollIconButton from 'components/EnrollIconButton'
import {get} from 'utils'

class ListUserPreview extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("ListUserPreview mdc-list-item", className)
  }

  render() {
    const user = get(this.props, "user", {})

    return (
      <li className={this.classes}>
        <Icon as="span" className="mdc-list-item__graphic" icon="user" />
        <span className="mdc-list-item__text">
          <Link className="mdc-list-item__primary-text" to={user.resourcePath}>
            {user.login}
          </Link>
          <span className="mdc-list-item__secondary-text">
            Joined on
            <span className="ml1">{moment(user.createdAt).format("MMM D, YYYY")}</span>
          </span>
        </span>
        <span className="mdc-list-item__meta">
          <div className="mdc-list-item__meta-actions">
            {user.viewerCanEnroll && !user.isViewer &&
            <EnrollIconButton enrollable={user} />}
            <Link
              className="rn-icon-link"
              to={user.resourcePath+"?tab=studies"}
            >
              <Icon className="rn-icon-link__icon" icon="study" />
              {get(user, "studies.totalCount", 0)}
            </Link>
          </div>
        </span>
      </li>
    )
  }
}

export default ListUserPreview

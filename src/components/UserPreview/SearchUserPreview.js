import * as React from 'react'
import cls from 'classnames'
import moment from 'moment'
import {Link} from 'react-router-dom'
import Icon from 'components/Icon'
import EnrollmentSelect from 'components/EnrollmentSelect'
import {get} from 'utils'

class SearchUserPreview extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("SearchUserPreview mdc-list-item", className)
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
        <span className="mdc-list-item__tags">
          {user.viewerCanEnroll && !user.isViewer &&
          <EnrollmentSelect enrollable={user} />}
        </span>
        <span className="mdc-list-item__meta">
          <Link
            className="rn-icon-link"
            to={user.resourcePath+"?tab=studies"}
          >
            <Icon className="rn-icon-link__icon" icon="study" />
            {get(user, "studyCount", 0)}
          </Link>
        </span>
      </li>
    )
  }
}

export default SearchUserPreview

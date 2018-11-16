import * as React from 'react'
import cls from 'classnames'
import {Link} from 'react-router-dom'
import EnrollIconButton from 'components/EnrollIconButton'
import ListEnrollButton from 'components/ListEnrollButton'
import Counter from 'components/Counter'
import Icon from 'components/Icon'
import List from 'components/List'
import Menu, {Corner} from 'components/mdc/Menu'
import {get, timeDifferenceForDate} from 'utils'

class ListUserPreview extends React.Component {
  state = {
    anchorElement: null,
    menuOpen: false,
  }

  setAnchorElement = (el) => {
    if (this.state.anchorElement) {
      return
    }
    this.setState({anchorElement: el})
  }

  get classes() {
    const {className} = this.props
    return cls("ListUserPreview rn-list-preview", className)
  }

  render() {
    const {anchorElement, menuOpen} = this.state
    const user = get(this.props, "user", {})

    return (
      <li className={this.classes}>
        <span className="mdc-list-item">
          <span className="mdc-list-item__graphic">
            <Icon as={Link} className="mdc-icon-button" to={user.resourcePath} icon="user" />
          </span>
          <Link className="mdc-list-item__text" to={user.resourcePath}>
            <span className="mdc-list-item__primary-text" to={user.resourcePath}>
              {user.login}
            </span>
            <span className="mdc-list-item__secondary-text">
              Joined {timeDifferenceForDate(user.createdAt)}
            </span>
          </Link>
          <span className="mdc-list-item__meta rn-list-preview__actions">
            <span className="rn-list-preview__actions--spread">
              {user.viewerCanEnroll && !user.isViewer &&
              <EnrollIconButton enrollable={user} />}
              <Link
                className="mdc-button rn-list-preview__action rn-list-preview__action--button"
                to={user.resourcePath+"?tab=studies"}
                aria-label="Studies"
                title="Studies"
              >
                <Icon className="mdc-button__icon" icon="study" />
                {get(user, "studies.totalCount", 0)}
              </Link>
            </span>
            <Menu.Anchor className="rn-list-preview__actions--collapsed" innerRef={this.setAnchorElement}>
              <button
                type="button"
                className="mdc-icon-button material-icons"
                onClick={() => this.setState({menuOpen: !menuOpen})}
              >
                more_vert
              </button>
              <Menu
                open={menuOpen}
                onClose={() => this.setState({menuOpen: false})}
                anchorElement={anchorElement}
                anchorCorner={Corner.BOTTOM_LEFT}
              >
                <List>
                  {user.viewerCanEnroll &&
                  <ListEnrollButton
                    className="mdc-list-item"
                    enrollable={get(this.props, "user", null)}
                  />}
                  <Link
                    className="mdc-list-item"
                    to={user.resourcePath+"?tab=studies"}
                  >
                    <Icon className="mdc-list-item__graphic mdc-theme--text-icon-on-background" icon="study" />
                    <span className="mdc-list-item__text">
                      Studies
                      <Counter>{get(user, "studies.totalCount", 0)}</Counter>
                    </span>
                  </Link>
                </List>
              </Menu>
            </Menu.Anchor>
          </span>
        </span>
      </li>
    )
  }
}

export default ListUserPreview

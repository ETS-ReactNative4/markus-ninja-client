import * as React from 'react'
import cls from 'classnames'
import {Link} from 'react-router-dom'
import List from 'components/mdc/List'
import Counter from 'components/Counter'
import Icon from 'components/Icon'
import Menu, {Corner} from 'components/mdc/Menu'
import {filterDefinedReactChildren, get, getHandleClickLink, timeDifferenceForDate} from 'utils'

class ListActivityPreview extends React.Component {
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
    return cls("ListActivityPreview rn-list-preview", className)
  }

  get timestamp() {
    const advancedAt = get(this.props, "activity.advancedAt", null)
    const createdAt = get(this.props, "activity.createdAt")

    if (advancedAt) {
      return `Advanced ${timeDifferenceForDate(advancedAt)}`
    } else {
      return `Created ${timeDifferenceForDate(createdAt)}`
    }
  }

  render() {
    const {anchorElement, menuOpen} = this.state
    const activity = get(this.props, "activity", {})

    return (
      <li className={this.classes}>
        <span className="mdc-list-item">
          <span className="mdc-list-item__graphic">
            <Icon as={Link} className="mdc-icon-button" to={activity.resourcePath} icon="activity" />
          </span>
          <span className="mdc-list-item__text">
            <span className="mdc-list-item__primary-text">
              <Link className="rn-link" to={activity.resourcePath}>
                {activity.name}
                <span className="mdc-theme--text-secondary-on-light ml1">#{activity.number}</span>
              </Link>
            </span>
            <span className="mdc-list-item__secondary-text">
              <span className="mr1">{this.timestamp}</span>
              by
              <Link
                className="rn-link rn-link--secondary ml1"
                to={get(activity, "owner.resourcePath", "")}
              >
                {get(activity, "owner.login", "")}
              </Link>

            </span>
          </span>
          <span className="mdc-list-item__meta rn-list-preview__actions">
            <span className="rn-list-preview__actions--spread">
              {activity.viewerCanAdmin && activity.isPublished &&
              <Icon
                as="span"
                className="mdc-theme--secondary rn-list-preview__action rn-list-preview__action--icon"
                icon="publish"
                label="Published"
              />}
              <Link
                className="mdc-button rn-list-preview__action rn-list-preview__action--button"
                to={activity.resourcePath}
                aria-label="Assets"
                title="Assets"
              >
                <Icon className="mdc-button__icon" icon="asset" />
                {get(activity, "assets.totalCount", 0)}
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
                {this.renderMenuList()}
              </Menu>
            </Menu.Anchor>
          </span>
        </span>
      </li>
    )
  }

  renderMenuList() {
    const activity = get(this.props, "activity", {})

    const listItems = [
      <List.Item onClick={getHandleClickLink(activity.resourcePath)}>
        <List.Item.Graphic graphic={
          <Icon className="mdc-theme--text-icon-on-background" icon="asset" />
        } />
        <List.Item.Text primaryText={
          <span>
            Assets
            <Counter>{get(activity, "assets.totalCount", 0)}</Counter>
          </span>
        }/>
      </List.Item>,
    ]

    return <List items={filterDefinedReactChildren(listItems)} />
  }
}

export default ListActivityPreview

import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { Link } from 'react-router-dom'
import List from 'components/mdc/List'
import Counter from 'components/Counter'
import Icon from 'components/Icon'
import Menu, {Corner} from 'components/mdc/Menu'
import {filterDefinedReactChildren, get, getHandleClickLink, timeDifferenceForDate} from 'utils'

class CardActivityPreview extends React.Component {
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
    return cls("CardActivityPreview mdc-card", className)
  }

  render() {
    const {menuOpen, anchorElement} = this.state
    const activity = get(this.props, "activity", {})

    return (
      <div className={this.classes}>
        <Link className="mdc-card__primary-action" to={activity.resourcePath}>
          <div className="rn-card__header">
            <Icon as="span" className="rn-card__header__graphic" icon="activity" />
            <div className="rn-card__text">
              <h6 className="rn-card__title">
                {activity.name}
              </h6>
              <div className="rn-card__subtitle">
                #{activity.number} created {timeDifferenceForDate(activity.createdAt)} by
                <span className="ml1">{get(activity, "owner.login", "")}</span>
              </div>
            </div>
          </div>
          <div className="rn-card__body rn-card__body-2">
            {activity.description}
          </div>
        </Link>
        <div className="mdc-card__actions rn-card__actions bottom">
          <div className="mdc-card__action-buttons">
            <Link
              className="mdc-button mdc-card__action mdc-card__action--button"
              to={activity.resourcePath}
            >
              Begin
            </Link>
          </div>
          <div className="mdc-card__action-icons rn-card__actions--spread">
            <Link
              className="mdc-button mdc-card__action mdc-card__action--button"
              to={activity.resourcePath}
              aria-label="Assets"
              title="Assets"
            >
              <Icon className="mdc-button__icon" icon="asset" />
              {get(activity, "assets.totalCount", 0)}
            </Link>
          </div>
          <div className="mdc-card__action-icons rn-card__actions--collapsed">
            <Menu.Anchor innerRef={this.setAnchorElement}>
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
          </div>
        </div>
      </div>
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

export default createFragmentContainer(CardActivityPreview, graphql`
  fragment CardActivityPreview_activity on Activity {
    advancedAt
    assets(first: 0) {
      totalCount
    }
    createdAt
    description
    descriptionHTML
    id
    name
    number
    owner {
      login
      resourcePath
    }
    resourcePath
    viewerCanAdmin
  }
`)

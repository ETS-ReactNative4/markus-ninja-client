import * as React from 'react'
import cls from 'classnames'
import moment from 'moment'
import {Link} from 'react-router-dom'
import AppleIconButton from 'components/AppleIconButton'
import EnrollIconButton from 'components/EnrollIconButton'
import ListAppleButton from 'components/ListAppleButton'
import ListEnrollButton from 'components/ListEnrollButton'
import Counter from 'components/Counter'
import Icon from 'components/Icon'
import List from 'components/List'
import Menu, {Corner} from 'components/mdc/Menu'
import {get} from 'utils'

class ListStudyPreview extends React.Component {
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
    return cls("ListStudyPreview rn-list-preview", className)
  }

  get timestamp() {
    const advancedAt = get(this.props, "study.advancedAt", null)
    const createdAt = get(this.props, "study.createdAt")

    if (advancedAt) {
      return `Advanced ${moment(advancedAt).format("MMM D")}`
    } else {
      return `Created ${moment(createdAt).format("MMM D")}`
    }
  }

  render() {
    const {anchorElement, menuOpen} = this.state
    const study = get(this.props, "study", {})
    const topicNodes = get(study, "topics.nodes", [])

    return (
      <li className={this.classes}>
        <span className="mdc-list-item">
          <Icon as="span" className="mdc-list-item__graphic" icon="study" />
          <span className="mdc-list-item__text">
            <span className="mdc-list-item__primary-text">
              <Link className="rn-link" to={study.resourcePath}>
                {study.name}
              </Link>
            </span>
            <span className="mdc-list-item__secondary-text">
              <span className="mr1">{this.timestamp}</span>
              by
              <Link
                className="rn-link rn-link--secondary ml1"
                to={get(study, "owner.resourcePath", "")}
              >
                {get(study, "owner.login", "")}
              </Link>
            </span>
          </span>
          <span className="rn-list-preview__tags">
            {topicNodes.map((node) =>
              node &&
              <Link
                key={node.id}
                className="mdc-button mdc-button--outlined"
                to={node.resourcePath}
              >
                {node.name}
              </Link>
            )}
          </span>
          <span className="mdc-list-item__meta rn-list-preview__actions">
            <span className="rn-list-preview__actions--spread">
              {study.viewerCanEnroll &&
              <EnrollIconButton
                className="rn-list-preview__action rn-list-preview__action--icon"
                enrollable={get(this.props, "study", null)}
              />}
              {study.viewerCanApple &&
              <AppleIconButton
                className="rn-list-preview__action rn-list-preview__action--icon"
                appleable={get(this.props, "study", null)}
              />}
              <Link
                className="rn-icon-link rn-list-preview__action rn-list-preview__action--icon"
                to={study.resourcePath+"/lessons"}
              >
                <Icon className="rn-icon-link__icon" icon="lesson" />
                {get(study, "lessons.totalCount", 0)}
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
                  {study.viewerCanEnroll &&
                  <ListEnrollButton enrollable={this.props.study} />}
                  {study.viewerCanApple &&
                  <ListAppleButton
                    className="mdc-list-item"
                    appleable={get(this.props, "study", null)}
                  />}
                  <Link
                    className="mdc-list-item"
                    to={study.resourcePath+"/lessons"}
                  >
                    <Icon className="mdc-list-item__graphic mdc-theme--text-icon-on-background" icon="lesson" />
                    <span className="mdc-list-item__text">
                      Lessons
                      <Counter>{get(study, "lessons.totalCount", 0)}</Counter>
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

export default ListStudyPreview

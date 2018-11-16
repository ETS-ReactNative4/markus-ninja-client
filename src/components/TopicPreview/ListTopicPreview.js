import * as React from 'react'
import cls from 'classnames'
import {Link} from 'react-router-dom'
import Counter from 'components/Counter'
import Icon from 'components/Icon'
import List from 'components/List'
import Menu, {Corner} from 'components/mdc/Menu'
import {get, timeDifferenceForDate} from 'utils'

class ListTopicPreview extends React.Component {
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
    return cls("ListTopicPreview rn-list-preview", className)
  }

  render() {
    const {anchorElement, menuOpen} = this.state
    const topic = get(this.props, "topic", {})

    return (
      <li className={this.classes}>
        <span className="mdc-list-item">
          <span className="mdc-list-item__graphic">
            <Icon as={Link} className="mdc-icon-button" to={topic.resourcePath} icon="topic" />
          </span>
          <Link className="mdc-list-item__text" to={topic.resourcePath}>
            <span className="mdc-list-item__primary-text">
              {topic.name}
            </span>
            <span className="mdc-list-item__secondary-text">
              First used
              <span className="ml1">{timeDifferenceForDate(topic.createdAt)}</span>
            </span>
          </Link>
          <span className="mdc-list-item__meta rn-list-preview__actions">
            <span className="rn-list-preview__actions--spread">
              <Link
                className="mdc-button rn-list-preview__action rn-list-preview__action--button"
                to={topic.resourcePath+"?t=course"}
                aria-label="Courses"
                title="Courses"
              >
                <Icon className="mdc-button__icon" icon="course" />
                {get(topic, "topicables.courseCount", 0)}
              </Link>
              <Link
                className="mdc-button rn-list-preview__action rn-list-preview__action--button"
                to={topic.resourcePath+"?t=study"}
                aria-label="Studies"
                title="Studies"
              >
                <Icon className="mdc-button__icon" icon="study" />
                {get(topic, "topicables.studyCount", 0)}
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
                  <Link
                    className="mdc-list-item"
                    to={topic.resourcePath+"?t=course"}
                  >
                    <Icon className="mdc-list-item__graphic mdc-theme--text-icon-on-background" icon="course" />
                    <span className="mdc-list-item__text">
                      Courses
                      <Counter>{get(topic, "topicables.courseCount", 0)}</Counter>
                    </span>
                  </Link>
                  <Link
                    className="mdc-list-item"
                    to={topic.resourcePath+"?t=study"}
                  >
                    <Icon className="mdc-list-item__graphic mdc-theme--text-icon-on-background" icon="study" />
                    <span className="mdc-list-item__text">
                      Studies
                      <Counter>{get(topic, "topicables.studyCount", 0)}</Counter>
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

export default ListTopicPreview

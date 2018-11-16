import * as React from 'react'
import cls from 'classnames'
import { Link } from 'react-router-dom'
import Counter from 'components/Counter'
import Icon from 'components/Icon'
import List from 'components/List'
import Menu, {Corner} from 'components/mdc/Menu'
import {get, timeDifferenceForDate} from 'utils'

class CardTopicPreview extends React.Component {
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
    return cls("CardTopicPreview mdc-card", className)
  }

  render() {
    const {anchorElement, menuOpen} = this.state
    const topic = get(this.props, "topic", {})

    return (
      <div className={this.classes}>
        <Link className="mdc-card__primary-action" to={topic.resourcePath}>
          <div className="rn-card__header">
            <Icon as="span" className="rn-card__header__graphic" icon="topic" />
            <div className="rn-card__text">
              <h6 className="rn-card__title">
                {topic.name}
              </h6>
              <div className="rn-card__subtitle">
                First used
                <span className="mh1">{timeDifferenceForDate(topic.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="rn-card__body rn-card__body-2">
            {topic.description}
          </div>
        </Link>
        <div className="mdc-card__actions rn-card__actions bottom">
          <div className="mdc-card__action-buttons">
            <Link
              className="mdc-button mdc-card__action mdc-card__action--button"
              to={topic.resourcePath}
            >
              Explore
            </Link>
          </div>
          <div className="mdc-card__action-icons rn-card__actions--spread">
            <Link
              className="mdc-button mdc-card__action mdc-card__action--button"
              to={topic.resourcePath+"?t=course"}
              aria-label="Courses"
              title="Courses"
            >
              <Icon className="mdc-button__icon" icon="course" />
              {get(topic, "topicables.courseCount", 0)}
            </Link>
            <Link
              className="mdc-button mdc-card__action mdc-card__action--button"
              to={topic.resourcePath+"?t=study"}
              aria-label="Studies"
              title="Studies"
            >
              <Icon className="mdc-button__icon" icon="study" />
              {get(topic, "topicables.studyCount", 0)}
            </Link>
          </div>
          <Menu.Anchor
            className="mdc-card__action-icons rn-card__actions--collapsed"
            innerRef={this.setAnchorElement}
          >
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
        </div>
      </div>
    )
  }
}

export default CardTopicPreview

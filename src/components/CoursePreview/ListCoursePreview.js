import * as React from 'react'
import cls from 'classnames'
import moment from 'moment'
import {Link} from 'react-router-dom'
import AppleIconButton from 'components/AppleIconButton'
import ListAppleButton from 'components/ListAppleButton'
import Counter from 'components/Counter'
import Icon from 'components/Icon'
import List from 'components/List'
import Menu from 'components/Menu'
import {get} from 'utils'

class ListCoursePreview extends React.Component {
  state = {
    menuOpen: false,
  }

  get classes() {
    const {className} = this.props
    return cls("ListCoursePreview rn-list-preview", className)
  }

  get timestamp() {
    const advancedAt = get(this.props, "course.advancedAt", null)
    const createdAt = get(this.props, "course.createdAt")

    if (advancedAt) {
      return `Advanced ${moment(advancedAt).format("MMM D")}`
    } else {
      return `Created ${moment(createdAt).format("MMM D")}`
    }
  }

  render() {
    const {menuOpen} = this.state
    const course = get(this.props, "course", {})
    const topicNodes = get(course, "topics.nodes", [])

    return (
      <li className={this.classes}>
        <span className="mdc-list-item">
          <Icon as="span" className="mdc-list-item__graphic" icon="course" />
          <Link className="mdc-list-item__text" to={course.resourcePath}>
            <span className="mdc-list-item__primary-text">
              {course.name}
              <span className="mdc-theme--text-secondary-on-light ml1">#{course.number}</span>
            </span>
            <span className="mdc-list-item__secondary-text">
              <span className="mr1">{this.timestamp}</span>
              by {get(course, "owner.login", "")}
            </span>
          </Link>
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
              {course.viewerCanApple &&
              <AppleIconButton appleable={get(this.props, "course", null)} />}
              <Link
                className="rn-icon-link"
                to={course.resourcePath}
              >
                <Icon className="rn-icon-link__icon" icon="lesson" />
                {get(course, "lessons.totalCount", 0)}
              </Link>
            </span>
          </span>
          <Menu.Anchor className="rn-list-preview__actions--collapsed">
            <button
              type="button"
              className="mdc-icon-button material-icons"
              onClick={() => this.setState({menuOpen: !menuOpen})}
            >
              more_vert
            </button>
            <Menu open={menuOpen} onClose={() => this.setState({menuOpen: false})}>
              <List className="mdc-list--sub-list">
                {course.viewerCanApple &&
                <ListAppleButton
                  className="mdc-list-item"
                  appleable={get(this.props, "course", null)}
                />}
                <Link
                  className="mdc-list-item"
                  to={course.resourcePath}
                >
                  <Icon className="mdc-list-item__graphic mdc-theme--text-icon-on-background" icon="lesson" />
                  <span className="mdc-list-item__text">
                    Lessons
                    <Counter>{get(course, "lessons.totalCount", 0)}</Counter>
                  </span>
                </Link>
              </List>
            </Menu>
          </Menu.Anchor>
        </span>
      </li>
    )
  }
}

export default ListCoursePreview

import * as React from 'react'
import cls from 'classnames'
import {Link} from 'react-router-dom'
import List from 'components/mdc/List'
import AppleIconButton from 'components/AppleIconButton'
import ListAppleButton from 'components/ListAppleButton'
import Counter from 'components/Counter'
import Icon from 'components/Icon'
import Menu, {Corner} from 'components/mdc/Menu'
import {filterDefinedReactChildren, get, getHandleClickLink, timeDifferenceForDate} from 'utils'

class ListCoursePreview extends React.Component {
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
    return cls("ListCoursePreview rn-list-preview", className)
  }

  get timestamp() {
    const advancedAt = get(this.props, "course.advancedAt", null)
    const createdAt = get(this.props, "course.createdAt")

    if (advancedAt) {
      return `Advanced ${timeDifferenceForDate(advancedAt)}`
    } else {
      return `Created ${timeDifferenceForDate(createdAt)}`
    }
  }

  render() {
    const {anchorElement, menuOpen} = this.state
    const course = get(this.props, "course", {})
    const topicNodes = get(course, "topics.nodes", [])

    return (
      <li className={this.classes}>
        <span className="mdc-list-item">
          <span className="mdc-list-item__graphic">
            <Icon as={Link} className="mdc-icon-button" to={course.resourcePath} icon="course" />
          </span>
          <span className="mdc-list-item__text">
            <span className="mdc-list-item__primary-text">
              <Link className="rn-link" to={course.resourcePath}>
                {course.name}
                <span className="mdc-theme--text-secondary-on-light ml1">#{course.number}</span>
              </Link>
            </span>
            <span className="mdc-list-item__secondary-text">
              <span className="mr1">{this.timestamp}</span>
              by
              <Link
                className="rn-link rn-link--secondary ml1"
                to={get(course, "owner.resourcePath", "")}
              >
                {get(course, "owner.login", "")}
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
              {course.viewerCanApple &&
              <AppleIconButton appleable={get(this.props, "course", null)} />}
              <Link
                className="mdc-button rn-list-preview__action rn-list-preview__action--button"
                to={course.resourcePath}
                aria-label="Lessons"
                title="Lessons"
              >
                <Icon className="mdc-button__icon" icon="lesson" />
                {get(course, "lessons.totalCount", 0)}
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
    const course = get(this.props, "course", {})

    const listItems = [
      course.viewerCanApple &&
      <ListAppleButton appleable={get(this.props, "course", null)} />,
      <List.Item onClick={getHandleClickLink(course.resourcePath)}>
        <List.Item.Graphic graphic={
          <Icon className="mdc-theme--text-icon-on-background" icon="lesson" />
        } />
        <List.Item.Text primaryText={
          <span>
            Lessons
            <Counter>{get(course, "lessons.totalCount", 0)}</Counter>
          </span>
        }/>
      </List.Item>,
    ]

    return <List items={filterDefinedReactChildren(listItems)} />
  }
}

export default ListCoursePreview

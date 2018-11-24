import * as React from 'react'
import cls from 'classnames'
import { Link } from 'react-router-dom'
import List from 'components/mdc/List'
import AppleIconButton from 'components/AppleIconButton'
import ListAppleButton from 'components/ListAppleButton'
import Counter from 'components/Counter'
import Icon from 'components/Icon'
import Menu, {Corner} from 'components/mdc/Menu'
import {filterDefinedReactChildren, get, getHandleClickLink, timeDifferenceForDate} from 'utils'

class CardCoursePreview extends React.Component {
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
    return cls("CardCoursePreview mdc-card", className)
  }

  render() {
    const {menuOpen, anchorElement} = this.state
    const course = get(this.props, "course", {})

    return (
      <div className={this.classes}>
        <Link className="mdc-card__primary-action" to={course.resourcePath}>
          <div className="rn-card__header">
            <Icon as="span" className="rn-card__header__graphic" icon="course" />
            <div className="rn-card__text">
              <h6 className="rn-card__title">
                {course.name}
              </h6>
              <div className="rn-card__subtitle">
                #{course.number} created on {timeDifferenceForDate(course.createdAt)} by
                <span className="ml1">{get(course, "owner.login", "")}</span>
              </div>
            </div>
          </div>
          <div className="rn-card__body rn-card__body-2">
            {course.description}
          </div>
        </Link>
        <div className="mdc-card__actions rn-card__actions bottom">
          <div className="mdc-card__action-buttons">
            <Link
              className="mdc-button mdc-card__action mdc-card__action--button"
              to={course.resourcePath}
            >
              Begin
            </Link>
          </div>
          <div className="mdc-card__action-icons rn-card__actions--spread">
            {course.viewerCanApple &&
            <AppleIconButton
              className="mdc-card__action mdc-card__action--icon"
              appleable={get(this.props, "course", null)}
            />}
            <Link
              className="mdc-button mdc-card__action mdc-card__action--button"
              to={course.resourcePath}
              aria-label="Lessons"
              title="Lessons"
            >
              <Icon className="mdc-button__icon" icon="lesson" />
              {get(course, "lessons.totalCount", 0)}
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

export default CardCoursePreview

import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { Link } from 'react-router-dom'
import List from 'components/mdc/List'
import EnrollIconButton from 'components/EnrollIconButton'
import ListEnrollButton from 'components/ListEnrollButton'
import Counter from 'components/Counter'
import Icon from 'components/Icon'
import Menu, {Corner} from 'components/mdc/Menu'
import {
  filterDefinedReactChildren,
  get,
  getHandleClickLink,
  timeDifferenceForDate,
} from 'utils'

class CardLessonPreview extends React.Component {
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
    return cls("CardLessonPreview mdc-card", className)
  }

  render() {
    const {anchorElement, menuOpen} = this.state
    const lesson = get(this.props, "lesson", {})

    return (
      <div className={this.classes}>
        <Link className="mdc-card__primary-action" to={lesson.resourcePath}>
          <div className="rn-card__header">
            <Icon as="span" className="rn-card__header__graphic" icon="lesson" />
            <div className="rn-card__text">
              <h6 className="rn-card__title">
                {lesson.title}
              </h6>
              <div className="rn-card__subtitle">
                #{lesson.number} created {timeDifferenceForDate(lesson.createdAt)} by
                <span className="ml1">{get(lesson, "author.login", "")}</span>
              </div>
            </div>
          </div>
        </Link>
        <div className="mdc-card__actions rn-card__actions">
          <div className="mdc-card__action-buttons">
            <Link
              className="mdc-button mdc-card__action mdc-card__action--button"
              to={lesson.resourcePath}
            >
              Read
            </Link>
          </div>
          <div className="mdc-card__action-icons rn-card__actions--spread">
            {lesson.viewerCanEnroll &&
            <EnrollIconButton
              className="mdc-card__action mdc-card__action--icon"
              enrollable={get(this.props, "lesson", null)}
            />}
            <Link
              className="mdc-button mdc-card__action mdc-card__action--button"
              to={lesson.resourcePath}
              aria-label="Comments"
              title="Comments"
            >
              <Icon className="mdc-button__icon" icon="comment" />
              {get(lesson, "comments.totalCount", 0)}
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
    const lesson = get(this.props, "lesson", {})

    const listItems = [
      lesson.viewerCanEnroll &&
      <ListEnrollButton enrollable={get(this.props, "lesson", null)}/>,
      <List.Item onClick={getHandleClickLink(lesson.resourcePath)}>
        <List.Item.Graphic graphic={
          <Icon className="mdc-theme--text-icon-on-background" icon="comment" />
        } />
        <List.Item.Text primaryText={
          <span>
            Comments
            <Counter>{get(lesson, "comments.totalCount", 0)}</Counter>
          </span>
        }/>
      </List.Item>,
    ]

    return <List items={filterDefinedReactChildren(listItems)} />
  }
}

CardLessonPreview.propTypes = {
  edit: PropTypes.bool,
  isCourse: PropTypes.bool,
  lesson: PropTypes.shape({
    author: PropTypes.shape({
      login: PropTypes.string.isRequired,
      resourcePath: PropTypes.string.isRequired,
    }).isRequired,
    createdAt: PropTypes.string.isRequired,
    comments: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
    }).isRequired,
    id: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired,
    resourcePath: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
}

CardLessonPreview.defaultProps = {
  edit: false,
  isCourse: false,
  lesson: {
    author: {
      login: "",
      resourcePath: "",
    },
    createdAt: "",
    comments: {
      totalCount: 0,
    },
    id: "",
    number: 0,
    resourcePath: "",
    title: "",
  }
}

export default createFragmentContainer(CardLessonPreview, graphql`
  fragment CardLessonPreview_lesson on Lesson {
    author {
      login
      resourcePath
    }
    comments(first: 0) {
      totalCount
    }
    createdAt
    enrollmentStatus
    id
    number
    resourcePath
    title
    viewerCanEnroll
  }
`)

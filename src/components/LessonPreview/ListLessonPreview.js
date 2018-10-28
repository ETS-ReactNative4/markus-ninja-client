import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import moment from 'moment'
import {Link} from 'react-router-dom'
import EnrollIconButton from 'components/EnrollIconButton'
import ListEnrollButton from 'components/ListEnrollButton'
import Counter from 'components/Counter'
import Icon from 'components/Icon'
import Label from 'components/Label'
import List from 'components/List'
import Menu from 'components/Menu'
import RemoveCourseLessonMutation from 'mutations/RemoveCourseLessonMutation'
import {get} from 'utils'

class ListLessonPreview extends React.Component {
  state = {
    menuOpen: false,
  }

  handleRemoveFromCourse = () => {
    if (get(this.props, "lesson.course.viewerCanAdmin", false)) {
      RemoveCourseLessonMutation(
        get(this.props, "lesson.course.id", ""),
        get(this.props, "lesson.id", ""),
        (response, errors) => {
          if (errors) {
            console.error(errors[0].message)
          }
        },
      )
    }
  }

  get classes() {
    const {className, dragging, editing} = this.props
    return cls("ListLessonPreview rn-list-preview", className, {
      "ListLessonPreview--editing": editing,
      "ListLessonPreview--dragging": dragging,
    })
  }

  get number() {
    const {isCourse, lesson} = this.props
    return isCourse ? lesson.courseNumber : lesson.number
  }

  get otherProps() {
    const {
      children,
      className,
      dragging,
      editing,
      innerRef,
      isCourse,
      lesson,
      ...otherProps
    } = this.props

    return otherProps
  }

  render() {
    const {editing, innerRef, isCourse, lesson} = this.props
    const labelNodes = get(lesson, "labels.nodes", [])

    if (!lesson) {
      return null
    }

    return (
      <li
        {...this.otherProps}
        ref={innerRef}
        className={this.classes}
      >
        <span className="mdc-list-item">
          <Icon as="span" className="mdc-list-item__graphic" icon="lesson" />
          <Link className="mdc-list-item__text" to={lesson.resourcePath}>
            <span className="mdc-list-item__primary-text">
              {lesson.title}
              <span className="mdc-theme--text-secondary-on-light ml1">#{this.number}</span>
            </span>
            <span className="mdc-list-item__secondary-text">
              Created on
              <span className="mh1">{moment(lesson.createdAt).format("MMM D")}</span>
              by {get(lesson, "author.login")}
            </span>
          </Link>
          <span className="rn-list-preview__tags">
            {labelNodes.map((node) =>
              node &&
              <Label key={node.id} as={Link} label={node} to={node.resourcePath} />
            )}
          </span>
          {isCourse && editing && get(lesson, "course.viewerCanAdmin", false)
          ? this.renderEditMeta()
          : this.renderMeta()}
        </span>
      </li>
    )
  }

  renderEditMeta() {
    return (
      <span className="mdc-list-item__meta">
        <button
          className="material-icons mdc-icon-button"
          type="button"
          onClick={this.handleRemoveFromCourse}
          aria-label="Remove lesson"
          title="Remove lesson"
        >
          remove
        </button>
      </span>
    )
  }

  renderMeta() {
    const {menuOpen} = this.state
    const {lesson} = this.props

    return (
      <span className="mdc-list-item__meta rn-list-preview__actions">
        <span className="rn-list-preview__actions--spread">
          {lesson.viewerCanEnroll &&
          <EnrollIconButton enrollable={get(this.props, "lesson", null)} />}
          <Link
            className="rn-icon-link"
            to={lesson.resourcePath}
          >
            <Icon className="rn-icon-link__icon" icon="comment" />
            {get(lesson, "comments.totalCount", 0)}
          </Link>
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
              {lesson.viewerCanEnroll &&
              <ListEnrollButton
                className="mdc-list-item"
                enrollable={get(this.props, "lesson", null)}
              />}
              <Link
                className="mdc-list-item"
                to={lesson.resourcePath}
              >
                <Icon className="mdc-list-item__graphic mdc-theme--text-icon-on-background" icon="comment" />
                <span className="mdc-list-item__text">
                  Comments
                  <Counter>{get(lesson, "comments.totalCount", 0)}</Counter>
                </span>
              </Link>
            </List>
          </Menu>
        </Menu.Anchor>
      </span>
    )
  }
}

ListLessonPreview.propTypes = {
  dragging: PropTypes.bool,
  editing: PropTypes.bool,
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
    course: PropTypes.shape({
      id: PropTypes.string,
      viewerCanAdmin: PropTypes.bool,
    }),
    courseNumber: PropTypes.number,
    id: PropTypes.string.isRequired,
    labels: PropTypes.shape({
      nodes: PropTypes.array,
    }).isRequired,
    number: PropTypes.number.isRequired,
    resourcePath: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
}

ListLessonPreview.defaultProps = {
  dragging: false,
  editing: false,
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
    course: {
      id: "",
      viewerCanAdmin: false,
    },
    courseNumber: 0,
    id: "",
    labels: {
      nodes: [],
    },
    number: 0,
    resourcePath: "",
    title: "",
  }
}

export default createFragmentContainer(ListLessonPreview, graphql`
  fragment ListLessonPreview_lesson on Lesson {
    author {
      login
      resourcePath
    }
    comments(first: 0) {
      totalCount
    }
    course {
      id
      viewerCanAdmin
    }
    courseNumber
    createdAt
    enrollmentStatus
    id
    labels(first: 5) {
      nodes {
        ...Label_label
        id
        resourcePath
      }
    }
    number
    resourcePath
    title
    viewerCanEnroll
  }
`)

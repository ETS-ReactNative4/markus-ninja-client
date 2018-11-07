import * as React from 'react'
import cls from 'classnames'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import {Link} from 'react-router-dom'
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'
import Icon from 'components/Icon'
import LessonPreview from 'components/LessonPreview'
import MoveCourseLessonMutation from 'mutations/MoveCourseLessonMutation'
import {get, isEmpty, moveListItem} from 'utils'
import AddCourseLessonDialog from './AddCourseLessonDialog'

import { LESSONS_PER_PAGE } from 'consts'

class CourseLessons extends React.Component {
  state = {
    addFormDialogOpen: false,
    edges: get(this.props, "course.lessons.edges", []),
    edit: false,
  }

  componentDidUpdate(prevProps) {
    const prevEdges = get(prevProps, "course.lessons.edges", [])
    const newEdges = get(this.props, "course.lessons.edges", [])
    if (prevEdges.length !== newEdges.length) {
      this.setState({edges: newEdges})
    }
  }

  handleDragEnd = (result) => {
    if (!result.destination) {
      return
    } else if (result.source.index === result.destination.index) {
      return
    }

    const {edges} = this.state

    const courseId = get(this.props, "course.id", "")
    const lessonId = get(edges[result.source.index], "node.id", "")
    const afterLessonId = get(edges[result.destination.index], "node.id", "")
    const lessonCourseNumber = get(edges[result.source.index], "node.courseNumber", 0)

    const newEdges = moveListItem(
      edges,
      result.source.index,
      result.destination.index
    )

    this.setState({edges: newEdges})

    MoveCourseLessonMutation(
      courseId,
      lessonId,
      afterLessonId,
      lessonCourseNumber,
      (response, errors) => {
        if (errors) {
          console.error(errors[0].message)
        }
        this.setState({edges: get(this.props, "course.lessons.edges", [])})
      },
    )
  }

  handleToggleAddFormDialog = () => {
    const {addFormDialogOpen} = this.state
    this.setState({
      addFormDialogOpen: !addFormDialogOpen,
    })
  }

  _loadMore = () => {
    const relay = get(this.props, "relay")
    if (!relay.hasMore()) {
      console.log("Nothing more to load")
      return
    } else if (relay.isLoading()){
      console.log("Request is already pending")
      return
    }

    relay.loadMore(LESSONS_PER_PAGE)
  }

  get classes() {
    const {className} = this.props
    return cls("CourseLessons mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  get firstLessonResourcePath() {
    const {edges} = this.state
    for (let edge of edges) {
      if (get(edge, "node.courseNumber") === 1) {
        return get(edge, "node.resourcePath", "")
      }
    }
    return ""
  }

  render() {
    const {addFormDialogOpen, edit, edges} = this.state
    const viewerCanAdmin = get(this.props, "course.viewerCanAdmin", false)
    const noResults = isEmpty(edges)

    return (
      <div className={this.classes}>
        <div className="mdc-card mdc-card--outlined ph2">
          {edit
          ? this.renderEdittableLessons()
          : this.renderLessons()}
          {(!noResults || viewerCanAdmin) &&
          <div className="mdc-card__actions">
            <div className="mdc-card__action-buttons">
              {!noResults
              ? <Link
                  className="mdc-button mdc-card__action mdc-card__action--button"
                  to={this.firstLessonResourcePath}
                >
                  Begin
                </Link>
              : viewerCanAdmin
                ? <button
                    className="mdc-button mdc-card__action mdc-card__action--button"
                    type="button"
                    onClick={this.handleToggleAddFormDialog}
                  >
                    Add lesson
                  </button>
              : null}
              {this.props.relay.hasMore() &&
              <button
                className="mdc-button mdc-button--unelevated mdc-card__action mdc-card__action--button"
                type="button"
                onClick={this._loadMore}
              >
                More
              </button>}
            </div>
            <div className="mdc-card__action-icons">
              {viewerCanAdmin &&
              <button
                className="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
                type="button"
                onClick={this.handleToggleAddFormDialog}
                aria-label="Add lesson"
                title="Add lesson"
              >
                add
              </button>}
              {!noResults && viewerCanAdmin &&
              <button
                className={cls(
                  "mdc-icon-button mdc-card__action mdc-card__action--icon",
                  {"mdc-icon-button--on": edit},
                )}
                aria-pressed={edit}
                type="button"
                onClick={() => this.setState({edit: !edit})}
                aria-label="Edit lessons"
                title="Edit lessons"
              >
                <i className="material-icons mdc-icon-button__icon">edit</i>
                <i className="material-icons mdc-icon-button__icon mdc-icon-button__icon--on mdc-theme--text-primary-on-background">edit</i>
              </button>}
            </div>
          </div>}
        </div>
        <AddCourseLessonDialog
          course={get(this.props, "course", null)}
          open={addFormDialogOpen}
          onClose={this.handleToggleAddFormDialog}
        />
      </div>
    )
  }

  renderEdittableLessons() {
    const {edges} = this.state

    return (
      <DragDropContext onDragEnd={this.handleDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <ul
              ref={provided.innerRef}
              className="mdc-list mdc-list--two-line"
            >
              {edges.map(({node}, index) => (
                node &&
                <Draggable key={node.id} draggableId={node.id} index={index}>
                  {(provided, snapshot) => (
                    <LessonPreview.List
                      innerRef={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      isCourse
                      dragging={snapshot.isDragging}
                      editing
                      lesson={node}
                    />
                  )}
                </Draggable>
              ))}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    )
  }

  renderLessons() {
    const {edges} = this.state
    const noResults = isEmpty(edges)

    return (
      <ul className="mdc-list mdc-list--two-line">
        {noResults
        ? this.renderEmptyListPlaceholder()
        : edges.map(({node}, index) => (
            node &&
            <LessonPreview.List
              key={node.id}
              isCourse
              lesson={node}
            />
          ))}
      </ul>
    )
  }

  renderEmptyListPlaceholder() {
    const viewerCanAdmin = get(this.props, "course.viewerCanAdmin", false)

    return (
      <li
        className="mdc-list-item pointer"
        onClick={viewerCanAdmin ? this.handleToggleAddFormDialog : null}
      >
        <Icon as="span" className="mdc-list-item__graphic" icon="lesson" />
        {viewerCanAdmin
        ? "Add the first lesson"
        : "No lessons"}
        {viewerCanAdmin &&
        <span className="mdc-list-item__meta">
          <i className="material-icons">add</i>
        </span>}
      </li>
    )
  }
}

export default createPaginationContainer(CourseLessons,
  {
    course: graphql`
      fragment CourseLessons_course on Course @argumentDefinitions(
        after: {type: "String"},
        count: {type: "Int!"},
      ) {
        ...AddCourseLessonDialog_course
        id
        lessons(
          first: $count,
          after: $after,
          orderBy:{direction: ASC field: COURSE_NUMBER}
        ) @connection(key: "CourseLessons_lessons", filters: []) {
          edges {
            cursor
            node {
              ...ListLessonPreview_lesson
              courseNumber
              id
              resourcePath
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
        viewerCanAdmin
      }
    `,
  },
  {
    direction: 'forward',
    query: graphql`
      query CourseLessonsForwardQuery(
        $owner: String!,
        $name: String!,
        $number: Int!,
        $count: Int!,
        $after: String
      ) {
        study(owner: $owner, name: $name) {
          course(number: $number) {
            ...CourseLessons_course @arguments(
              after: $after,
              count: $count,
            )
          }
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "course.lessons")
    },
    getFragmentVariables(previousVariables, totalCount) {
      return {
        ...previousVariables,
        count: totalCount,
      }
    },
    getVariables(props, paginationInfo, getFragmentVariables) {
      return {
        owner: props.match.params.owner,
        name: props.match.params.name,
        number: parseInt(this.props.match.params.number, 10),
        count: paginationInfo.count,
        after: paginationInfo.cursor,
      }
    },
  },
)

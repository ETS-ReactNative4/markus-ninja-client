import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import AppleButton from 'components/AppleButton'
import StudyLink from 'components/StudyLink'
import UserLink from 'components/UserLink'
import DeleteCourseMutation from 'mutations/DeleteCourseMutation'
import { get, isNil } from 'utils'

class CourseHeader extends React.Component {
  state = {
    edit: false,
  }

  handleDelete = () => {
    const {course} = this.props
    DeleteCourseMutation(
      get(course, "id", ""),
      (response, error) => {
        if (!isNil(error)) {
          this.setState({ error: error.message })
        } else {
          this.props.history.replace(get(course, "study.resourcePath", "") + "/courses")
        }
      },
    )
  }

  get classes() {
    const {className} = this.props
    return cls("CourseHeader mdc-layout-grid__inner", className)
  }

  render() {
    const course = get(this.props, "course", null)
    if (isNil(course)) {
      return null
    }
    return (
      <div className={this.classes}>
        <h5 className={cls(
          "mdc-layout-grid__cell",
          "mdc-layout-grid__cell--span-7-desktop",
          "mdc-layout-grid__cell--span-4-tablet",
          "mdc-layout-grid__cell--span-4-phone",
        )}>
          <UserLink className="rn-link" user={get(course, "study.owner", null)} />
          <span>/</span>
          <StudyLink className="rn-link" study={get(course, "study", null)} />
          <span>/</span>
          <span><strong>{get(course, "name", "")}</strong></span>
          <span className="mdc-theme--text-hint-on-light ml2">#{get(course, "number", 0)}</span>
        </h5>
        <div className={cls(
          "mdc-layout-grid__cell",
          "mdc-layout-grid__cell--span-5-desktop",
          "mdc-layout-grid__cell--span-4-tablet",
          "mdc-layout-grid__cell--span-4-phone",
        )}>
          <div className="CourseHeader__actions">
            <div className={cls(
              "CourseHeader__action",
              "CourseHeader__action--apple",
            )}>
              <AppleButton appleable={course} />
              <button className="rn-count-button">
                {get(course, "appleGivers.totalCount", 0)}
              </button>
            </div>
            {get(course, "viewerCanAdmin", false) &&
            <div className={cls(
              "CourseHeader__action",
              "CourseHeader__action--delete",
            )}>
              <button
                className="material-icons mdc-icon-button"
                type="button"
                onClick={this.handleDelete}
                aria-label="Delete course"
                title="Delete course"
              >
                delete
              </button>
            </div>}
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(createFragmentContainer(CourseHeader, graphql`
  fragment CourseHeader_course on Course {
    ...AppleButton_appleable
    id
    advancedAt
    appleGivers(first: 0) {
      totalCount
    }
    createdAt
    name
    number
    study {
      ...StudyLink_study
      resourcePath
      owner {
        ...UserLink_user
      }
    }
    updatedAt
    viewerCanAdmin
  }
`))

import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link, withRouter } from 'react-router-dom'
import Icon from 'components/Icon'
import AppleButton from 'components/AppleButton'
import StudyLink from 'components/StudyLink'
import UserLink from 'components/UserLink'
import {get} from 'utils'

class CourseHeader extends React.Component {
  render() {
    const course = get(this.props, "course", null)

    return (
      <header className="rn-header mdc-typography--headline5 mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
        <UserLink className="rn-link" user={get(course, "study.owner", null)} />
        <span>/</span>
        <StudyLink className="rn-link" study={get(course, "study", null)} />
        <span>/</span>
        <span>
          <Icon className="v-mid mr1" icon="course" />
          <span className="fw5">{get(course, "name", "")}</span>
          <span className="mdc-theme--text-hint-on-light ml2">#{get(course, "number", 0)}</span>
        </span>
        <div className="rn-header__meta">
          <div className="rn-combo-button">
            <AppleButton appleable={course} />
            <Link
              className="rn-combo-button__count"
              to={course.resourcePath+"/applegivers"}
            >
              {get(course, "appleGiverCount", 0)}
            </Link>
          </div>
        </div>
      </header>
    )
  }
}

export default withRouter(createFragmentContainer(CourseHeader, graphql`
  fragment CourseHeader_course on Course {
    ...AppleButton_appleable
    id
    advancedAt
    appleGiverCount
    createdAt
    name
    number
    resourcePath
    study {
      ...StudyLink_study
      owner {
        ...UserLink_user
      }
    }
    updatedAt
    viewerCanAdmin
  }
`))

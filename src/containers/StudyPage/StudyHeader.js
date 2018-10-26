import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link, withRouter } from 'react-router-dom'
import AppleButton from 'components/AppleButton'
import EnrollmentSelect from 'components/EnrollmentSelect'
import IconLink from 'components/IconLink'
import StudyLink from 'components/StudyLink'
import UserLink from 'components/UserLink'
import { get, isNil } from 'utils'

class StudyHeader extends React.Component {
  state = {
    edit: false,
  }

  get classes() {
    const {className} = this.props
    return cls("rn-header mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const study = get(this.props, "study", null)
    if (isNil(study)) {
      return null
    }

    return (
      <header className={this.classes}>
        <h5>
          <UserLink className="rn-link" user={get(study, "owner", null)} />
          <span>/</span>
          <StudyLink className="rn-link" study={study} />
        </h5>
        <div className="rn-header__meta">
          {get(study, "viewerCanAdmin", false) &&
          <IconLink
            className="mdc-icon-button"
            to={study.resourcePath + "/lessons/new"}
            aria-label="New lesson"
            title="New lesson"
          >
            add
          </IconLink>}
          <div className="rn-combo-button mr2">
            <EnrollmentSelect disabled={!study.viewerCanEnroll} enrollable={study} />
            <Link
              className="rn-combo-button__count"
              to={study.resourcePath+"/enrollees"}
            >
              {get(study, "enrollees.totalCount", 0)}
            </Link>
          </div>
          <div className="rn-combo-button">
            <AppleButton disabled={!study.viewerCanApple} appleable={study} />
            <Link
              className="rn-combo-button__count"
              to={study.resourcePath+"/applegivers"}
            >
              {get(study, "appleGivers.totalCount", 0)}
            </Link>
          </div>
        </div>
      </header>
    )
  }
}

export default withRouter(createFragmentContainer(StudyHeader, graphql`
  fragment StudyHeader_study on Study {
    ...StudyLink_study
    ...AppleButton_appleable
    advancedAt
    appleGivers(first: 0) {
      totalCount
    }
    createdAt
    enrollees(first: 0) {
      totalCount
    }
    enrollmentStatus
    id
    name
    owner {
      ...UserLink_user
    }
    resourcePath
    updatedAt
    viewerCanAdmin
    viewerCanApple
    viewerCanEnroll
  }
`))

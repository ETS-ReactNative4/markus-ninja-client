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
    return cls("rn-header", className)
  }

  render() {
    const study = get(this.props, "study", null)
    if (isNil(study)) {
      return null
    }

    return (
      <header className={this.classes}>
        <h5 className="rn-file-path">
          <UserLink className="rn-link rn-file-path__directory" user={get(study, "owner", null)} />
          <span className="rn-file-path__separator">/</span>
          <span className="rn-file-path__file">
            <StudyLink className="rn-link rn-file-path__file__text" study={study} />
            {get(study, "viewerCanAdmin", false) &&
            <IconLink
              className="mdc-icon-button rn-file-path__file__icon"
              to={study.resourcePath + "/lessons/new"}
              aria-label="New lesson"
              title="New lesson"
            >
              add
            </IconLink>}
          </span>
        </h5>
        <div className="rn-header__actions">
          <div className="rn-combo-button rn-header__action rn-header__action--button">
            <EnrollmentSelect disabled={!study.viewerCanEnroll} enrollable={study} />
            <Link
              className="rn-combo-button__count"
              to={study.resourcePath+"/enrollees"}
            >
              {get(study, "enrollees.totalCount", 0)}
            </Link>
          </div>
          <div className="rn-combo-button rn-header__action rn-header__action--button">
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

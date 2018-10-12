import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link, withRouter } from 'react-router-dom'
import AppleButton from 'components/AppleButton'
import EnrollmentSelect from 'components/EnrollmentSelect'
import StudyLink from 'components/StudyLink'
import UserLink from 'components/UserLink'
import { get, isNil } from 'utils'

class StudyHeader extends React.Component {
  state = {
    edit: false,
  }

  get classes() {
    const {className} = this.props
    return cls("rn-header mdc-typography--headline5 mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const study = get(this.props, "study", null)
    if (isNil(study)) {
      return null
    }

    return (
      <header className={this.classes}>
        <UserLink className="rn-link" user={get(study, "owner", null)} />
        <span>/</span>
        <StudyLink className="rn-link" study={study} />
        <div className="rn-header__meta">
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
    ...EnrollmentSelect_enrollable
    id
    advancedAt
    appleGivers(first: 0) {
      totalCount
    }
    createdAt
    enrollees(first: 0) {
      totalCount
    }
    name
    owner {
      ...UserLink_user
    }
    resourcePath
    updatedAt
    viewerCanApple
    viewerCanEnroll
  }
`))

import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { Link, withRouter } from 'react-router-dom'
import AppleButton from 'components/AppleButton'
import EnrollmentSelect from 'components/EnrollmentSelect'
import StudyLink from 'components/StudyLink'
import UserLink from 'components/UserLink'
import {get} from 'utils'

import Context from './Context'

class StudyHeader extends React.Component {
  state = {
    edit: false,
  }

  get classes() {
    const {className} = this.props
    return cls("rn-header rn-header--title", className)
  }

  render() {
    const {toggleCreateLessonDialog} = this.context
    const study = get(this.props, "study", null)
    if (!study) {
      return null
    }

    return (
      <header className={this.classes}>
        <h4 className="rn-file-path">
          <UserLink className="rn-link rn-file-path__directory" user={get(study, "owner", null)} />
          <span className="rn-file-path__separator">/</span>
          <span className="rn-file-path__file">
            <StudyLink className="rn-link rn-file-path__file__text" study={study} />
            {get(study, "viewerCanAdmin", false) &&
            <button
              type="button"
              className="material-icons mdc-icon-button"
              onClick={toggleCreateLessonDialog}
              aria-label="New lesson"
              title="New lesson"
            >
              add
            </button>}
          </span>
        </h4>
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

StudyHeader.contextType = Context

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

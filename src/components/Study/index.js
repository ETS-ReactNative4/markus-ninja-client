import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import AppleButton from 'components/AppleButton'
import EnrollmentSelect from 'components/EnrollmentSelect'
import StudyLink from 'components/StudyLink'
import UserLink from 'components/UserLink'
import StudyTabs from './StudyTabs'
import { get, isNil } from 'utils'

import './Study.css'

class Study extends React.Component {
  state = {
    edit: false,
  }

  render() {
    const study = get(this.props, "study", null)
    if (isNil(study)) {
      return null
    }
    return (
      <div className="Study">
        <div className="study-header">
          <div className="study-name mdc-typography--headline5">
            <UserLink user={get(study, "owner", null)} />
            <span>/</span>
            <StudyLink study={study} />
          </div>
          <div className="study-actions">
            <div className="study-enroll">
              <EnrollmentSelect enrollable={study} />
              <button className="rn-count-button">
                {get(study, "enrolleeCount", 0)}
              </button>
            </div>
            <div className="study-apple">
              <AppleButton appleable={study} />
              <button className="rn-count-button">
                {get(study, "appleGivers.totalCount", 0)}
              </button>
            </div>
          </div>
        </div>
        <StudyTabs study={study} />
      </div>
    )
  }
}

export default withRouter(createFragmentContainer(Study, graphql`
  fragment Study_study on Study {
    id
    advancedAt
    appleGivers(first: 0) {
      totalCount
    }
    createdAt
    enrolleeCount
    name
    owner {
      ...UserLink_user
    }
    updatedAt
    ...StudyLink_study
    ...AppleButton_appleable
    ...EnrollmentSelect_enrollable
    ...StudyTabs_study
  }
`))

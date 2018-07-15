import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { get } from 'utils'
import UpdateStudyNameForm from 'components/UpdateStudyNameForm'
import StudyDangerZoneForm from 'components/StudyDangerZoneForm'

class StudySettings extends Component {
  render() {
    const study = get(this.props, "study", {})
    return (
      <div className="StudySettings">
        <UpdateStudyNameForm study={study} />
        <StudyDangerZoneForm study={study} />
      </div>
    )
  }
}

export default createFragmentContainer(StudySettings, graphql`
  fragment StudySettings_study on Study {
    id
    name
  }
`)

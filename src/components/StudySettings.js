import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { get } from 'utils'
import UpdateStudyNameForm from 'components/UpdateStudyNameForm'
import StudyDangerZone from 'components/StudyDangerZone'

class StudySettings extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("StudySettings mdc-layout-grid__inner", className)
  }

  render() {
    const study = get(this.props, "study", null)
    return (
      <div className={this.classes}>
        <h5 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">Settings</h5>
        <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <UpdateStudyNameForm study={study} />
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <StudyDangerZone study={study} />
        </div>
      </div>
    )
  }
}

export default createFragmentContainer(StudySettings, graphql`
  fragment StudySettings_study on Study {
    ...StudyDangerZone_study
    ...UpdateStudyNameForm_study
  }
`)

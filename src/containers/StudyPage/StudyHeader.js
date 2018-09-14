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
import StudyNav from './StudyNav'
import { get, isNil } from 'utils'

class StudyHeader extends React.Component {
  state = {
    edit: false,
  }

  get classes() {
    const {className} = this.props
    return cls("StudyHeader mdc-layout-grid__inner", className)
  }

  render() {
    const study = get(this.props, "study", null)
    if (isNil(study)) {
      return null
    }

    return (
      <div className={this.classes}>
        <div className={cls(
          "mdc-layout-grid__cell",
          "mdc-layout-grid__cell--span-7-desktop",
          "mdc-layout-grid__cell--span-4-tablet",
          "mdc-layout-grid__cell--span-4-phone",
          "mdc-typography--headline5",
        )}>
          <UserLink user={get(study, "owner", null)} />
          <span>/</span>
          <StudyLink study={study} />
        </div>
        <div className={cls(
          "mdc-layout-grid__cell",
          "mdc-layout-grid__cell--span-5-desktop",
          "mdc-layout-grid__cell--span-4-tablet",
          "mdc-layout-grid__cell--span-4-phone",
        )}>
          <div className="StudyHeader__actions">
            <div className={cls(
              "StudyHeader__action",
              "StudyHeader__action--enroll",
            )}>
              <EnrollmentSelect disabled={!study.viewerCanEnroll} enrollable={study} />
              <Link
                className="rn-count-button"
                to={study.resourcePath+"/enrollees"}
              >
                {get(study, "enrolleeCount", 0)}
              </Link>
            </div>
            <div className={cls(
              "StudyHeader__action",
              "StudyHeader__action--apple",
            )}>
              <AppleButton disabled={!study.viewerCanApple} appleable={study} />
              <Link
                className="rn-count-button"
                to={study.resourcePath+"/applegivers"}
              >
                {get(study, "appleGivers.totalCount", 0)}
              </Link>
            </div>
          </div>
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <StudyNav study={study} />
        </div>
      </div>
    )
  }
}

export default withRouter(createFragmentContainer(StudyHeader, graphql`
  fragment StudyHeader_study on Study {
    ...StudyLink_study
    ...AppleButton_appleable
    ...EnrollmentSelect_enrollable
    ...StudyNav_study
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
    resourcePath
    updatedAt
    viewerCanApple
    viewerCanEnroll
  }
`))

import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import {Link} from 'react-router-dom'
import {get} from 'utils'

class StudyCoursesLanding extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("StudyCoursesLanding", className)
  }

  render() {
    const study = get(this.props, "study", {})

    return (
      <div className={this.classes}>
        <div className="mdc-layout-grid">
          <div className="mdc-layout-grid__inner">
            <div className={cls(
              "mdc-layout-grid__cell",
              "mdc-layout-grid__cell--span-8-desktop",
              "mdc-layout-grid__cell--span-8-tablet",
              "mdc-layout-grid__cell--span-4-phone",
            )}>
              <p className="mdc-typography--headline4">
                Organize your lessons into courses
              </p>
            </div>
            <div className={cls(
              "mdc-layout-grid__cell",
              "mdc-layout-grid__cell--span-4-desktop",
              "mdc-layout-grid__cell--span-8-tablet",
              "mdc-layout-grid__cell--span-4-phone",
              "mdc-layout-grid__cell--align-middle",
            )}>
              <div className="inline-flex justify-end pv3 w-100">
                <Link
                  className="mdc-button mdc-button--unelevated"
                  to={study.resourcePath + "/courses/new"}
                >
                  New course
                </Link>
              </div>
            </div>
            <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
            <div className={cls(
              "mdc-layout-grid__cell",
              "mdc-layout-grid__cell--span-4",
            )}>
              <div className="flex flex-column items-center">
                <div className="mdc-typography--headline6">
                  Sort lessons
                </div>
                <p>Organize lessons sequentially to be taken one after the other.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default createFragmentContainer(StudyCoursesLanding, graphql`
  fragment StudyCoursesLanding_study on Study {
    resourcePath
  }
`)

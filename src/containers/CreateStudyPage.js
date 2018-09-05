import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import CreateStudyForm from 'components/CreateStudyForm'

class CreateStudyPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("CreateStudyPage mdc-layout-grid mw7", className)
  }

  render() {
    return (
      <div className={this.classes}>
        <div className="mdc-layout-grid__inner">
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <div className="mdc-typography--headline4">Create a new study</div>
            <div className="mdc-typography--subtitle1 mdc-theme--text-secondary-on-light pb3">
              A study contains all your lessons, courses, and assets
            </div>
          </div>
          <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <CreateStudyForm user={this.props.user} />
          </div>
        </div>
      </div>
    )
  }
}

export default createFragmentContainer(CreateStudyPage, graphql`
  fragment CreateStudyPage_user on User {
    ...CreateStudyForm_user
  }
`)

import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import CreateStudyForm from 'components/CreateStudyForm'

class CreateStudyPage extends React.Component {
  render() {
    return (
      <div className="CreateStudyPage center mw7">
        <div className="mdc-typography--headline4">Create a new study</div>
        <div className="mdc-typography--subtitle1">
          A study contains all your lessons, courses, and assets
        </div>
        <CreateStudyForm user={this.props.user} />
      </div>
    )
  }
}

export default createFragmentContainer(CreateStudyPage, graphql`
  fragment CreateStudyPage_user on User {
    ...CreateStudyForm_user
  }
`)

import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import CreateLessonForm from 'components/CreateLessonForm'
import { COURSES_PER_PAGE } from 'consts'

const CreateLessonPageQuery = graphql`
  query CreateLessonPageQuery($owner: String!, $name: String!, $count: Int!, $after: String, $filename: String!) {
    study(owner: $owner, name: $name) {
      ...CreateLessonForm_study
    }
  }
`

class CreateLessonPage extends Component {
  render() {
    const { match } = this.props
    return (
      <QueryRenderer
        environment={environment}
        query={CreateLessonPageQuery}
        variables={{
          owner: match.params.owner,
          name: match.params.name,
          count: COURSES_PER_PAGE,
          filename: "",
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return <CreateLessonForm study={props.study}></CreateLessonForm>
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default CreateLessonPage

import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import CreateCourseForm from 'components/CreateCourseForm'

const CreateCoursePageQuery = graphql`
  query CreateCoursePageQuery($owner: String!, $name: String!) {
    study(owner: $owner, name: $name) {
      ...CreateCourseForm_study
    }
  }
`

class CreateCoursePage extends Component {
  render() {
    const { match } = this.props
    return (
      <QueryRenderer
        environment={environment}
        query={CreateCoursePageQuery}
        variables={{
          owner: match.params.owner,
          name: match.params.name,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return <CreateCourseForm study={props.study} />
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default CreateCoursePage

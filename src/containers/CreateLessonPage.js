import * as React from 'react'
import cls from 'classnames'
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

class CreateLessonPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("CreateLessonPage", className)
  }

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
            return (
              <div className={this.classes}>
                <CreateLessonForm study={props.study}></CreateLessonForm>
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default CreateLessonPage

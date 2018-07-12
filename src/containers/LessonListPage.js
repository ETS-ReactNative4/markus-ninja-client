import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import environment from 'Environment'
import LessonList from 'components/LessonList'

const LessonListPageQuery = graphql`
  query LessonListPageQuery($owner: String!, $name: String!) {
    study(owner: $owner, name: $name) {
      ...LessonList_study
    }
  }
`

class LessonListPage extends Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={LessonListPageQuery}
        variables={{
          owner: this.props.match.params.owner,
          name: this.props.match.params.name,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <div>
                <Link
                  className="LessonListPage__new-lesson"
                  to={this.props.location.pathname + "/new"}
                >
                  New lesson
                </Link>
                <LessonList study={props.study}></LessonList>
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default LessonListPage

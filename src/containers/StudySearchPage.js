import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import StudySearch from 'components/StudySearch'
import NotFound from 'components/NotFound'
import { isNil } from 'utils'

const StudySearchPageQuery = graphql`
  query StudySearchPageQuery($owner: String!, $name: String!) {
    study(owner: $owner, name: $name) {
      ...StudySearch_study
    }
  }
`

class StudySearchPage extends Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={StudySearchPageQuery}
        variables={{
          owner: this.props.match.params.owner,
          name: this.props.match.params.name,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            if (isNil(props.study)) {
              return <NotFound />
            }
            return <StudySearch study={props.study} />
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default StudySearchPage

import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import StudyList from 'components/StudyList'

const StudyListPageQuery = graphql`
  query StudyListPageQuery {
    viewer {
      ...StudyList_viewer
    }
  }
`

class StudyListPage extends Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={StudyListPageQuery}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return <StudyList viewer={props.viewer}></StudyList>
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default StudyListPage

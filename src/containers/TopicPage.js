import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import TopicSearchPage from 'containers/TopicSearchPage'

const TopicPageQuery = graphql`
  query TopicPageQuery($name: String!) {
    topic(name: $name) {
      id
    }
  }
`

class TopicPage extends Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={TopicPageQuery}
        variables={{
          name: this.props.match.params.name,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <div className="TopicPage">
                <TopicSearchPage topic={props.topic} />
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default TopicPage

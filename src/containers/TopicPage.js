import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import TopicTopicables from 'components/TopicTopicables'
import { TOPICABLES_PER_PAGE } from 'consts'

const TopicPageQuery = graphql`
  query TopicPageQuery($count: Int!, $after: String, $name: String!) {
    topic(name: $name) {
      id
      name
      ...TopicTopicables_topic
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
          count: TOPICABLES_PER_PAGE,
          name: this.props.match.params.name,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <div className="TopicPage">
                <TopicTopicables topic={props.topic} />
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

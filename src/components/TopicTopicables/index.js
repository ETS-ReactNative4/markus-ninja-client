import * as React from 'react'
import PropTypes from 'prop-types'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import TopicTopicablesContainer, {TopicTopicablesProp, TopicTopicablesPropDefaults} from './TopicTopicablesContainer'

import { TOPICABLES_PER_PAGE } from 'consts'

const TopicTopicablesQuery = graphql`
  query TopicTopicablesQuery(
    $name: String!,
    $after: String,
    $count: Int!,
    $orderBy: TopicableOrder,
    $search: String,
    $type: TopicableType!
  ) {
    topic(name: $name) {
      ...TopicTopicablesContainer_topic @arguments(
        after: $after,
        count: $count,
        orderBy: $orderBy,
        search: $search,
        type: $type,
      )
    }
  }
`

class TopicTopicables extends React.Component {
  constructor(props) {
    super(props)

    const {orderBy, search, type} = this.props

    this.state = {
      orderBy,
      search,
      type,
    }
  }

  render() {
    const {orderBy, search, type} = this.state
    const {count, match} = this.props

    return (
      <QueryRenderer
        environment={environment}
        query={TopicTopicablesQuery}
        variables={{
          name: match.params.name,
          count,
          orderBy,
          search,
          type,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const {children, orderBy, search, type} = this.props

            return (
              <TopicTopicablesContainer
                count={count}
                orderBy={orderBy}
                search={search}
                type={type}
                topic={props.topic}
              >
                {children}
              </TopicTopicablesContainer>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

TopicTopicables.propTypes = {
  count: PropTypes.number,
  orderBy: PropTypes.shape({
    direction: PropTypes.string,
    field: PropTypes.string,
  }),
  search: PropTypes.string,
  type: PropTypes.string.isRequired,
}

TopicTopicables.defaultProps = {
  count: TOPICABLES_PER_PAGE,
}

export {TopicTopicablesProp, TopicTopicablesPropDefaults}
export default withRouter(TopicTopicables)

import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import queryString from 'query-string'
import environment from 'Environment'
import Search from 'components/Search'
import TopicHeader from './TopicHeader'
import TopicPageResults from './TopicPageResults'
import NotFound from 'components/NotFound'
import {get, isNil} from 'utils'

const TopicPageQuery = graphql`
  query TopicPageQuery($name: String!) {
    topic(name: $name) {
      ...TopicHeader_topic
      id
    }
  }
`

class TopicPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("TopicPage mdc-layout-grid", className)
  }

  get _query() {
    const searchQuery = queryString.parse(get(this.props, "location.search", ""))
    const direction = get(searchQuery, "o", "desc").toUpperCase()
    const query = get(searchQuery, "q", "")
    const type = get(searchQuery, "t", "study").toUpperCase()
    const field = (() => {
      switch (get(searchQuery, "s", "").toLowerCase()) {
        case "advanced":
          return "ADVANCED_AT"
        case "apples":
          return "APPLE_COUNT"
        case "created":
          return "CREATED_AT"
        case "comments":
          return "COMMENT_COUNT"
        case "lessons":
          return "LESSON_COUNT"
        case "studies":
          return "STUDY_COUNT"
        case "updated":
          return "UPDATED_AT"
        default:
          return "BEST_MATCH"
      }
    })()

    return {
      orderBy: {
        direction,
        field,
      },
      query,
      type,
    }
  }

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
            if (isNil(props.topic)) {
              return <NotFound />
            }

            const query = this._query
            const topicId = get(props, "topic.id", "")

            return (
              <div className={this.classes}>
                <div className="mdc-layout-grid__inner">
                  <TopicHeader topic={get(props, "topic", null)} />
                  <Search
                    type={query.type}
                    query={query.query}
                    orderBy={query.orderBy}
                    within={topicId}
                  >
                    <TopicPageResults />
                  </Search>
                </div>
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

import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import queryString from 'query-string'
import environment from 'Environment'
import TopicHeader from './TopicHeader'
import TopicTopicables from 'components/TopicTopicables'
import TopicPageTopicables from './TopicPageTopicables'
import NotFound from 'components/NotFound'
import {get, isNil} from 'utils'

const TopicPageQuery = graphql`
  query TopicPageQuery($name: String!) {
    topic(name: $name) {
      ...TopicHeader_topic
    }
  }
`

class TopicPage extends React.Component {
  constructor(props) {
    super(props)

    const searchQuery = queryString.parse(get(this.props, "location.search", ""))
    const {o, q, s, t} = searchQuery

    this.state = {o, q, s, t}
  }

  componentDidUpdate(prevProps) {
    const prevSearch = get(prevProps, "location.search", "")
    const newSearch = get(this.props, "location.search", "")
    if (prevSearch !== newSearch) {
      const searchQuery = queryString.parse(get(this.props, "location.search", ""))
      const {o, q, s, t} = searchQuery
      this.setState({o, q, s, t})
    }
  }

  get classes() {
    const {className} = this.props
    return cls("TopicPage mdc-layout-grid", className)
  }

  get _orderBy() {
    const {o, s} = this.state
    const direction = (() => {
      switch (s) {
      case "asc":
        return "ASC"
      case "desc":
        return "DESC"
      default:
        return "DESC"
      }
    })()
    const field = (() => {
      switch (o) {
      case "topiced":
        return "TOPICED_AT"
      default:
        return "TOPICED_AT"
      }
    })()

    return {direction, field}
  }

  get _type() {
    const {t} = this.state
    switch ((t || "").toLowerCase()) {
      case "course":
        return "COURSE"
      case "study":
        return "STUDY"
      default:
        return "STUDY"
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

            const {q} = this.state

            return (
              <div className={this.classes}>
                <div className="mdc-layout-grid__inner">
                  <TopicHeader topic={get(props, "topic", null)} />
                  <TopicTopicables orderBy={this._orderBy} search={q} type={this._type}>
                    <TopicPageTopicables />
                  </TopicTopicables>
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

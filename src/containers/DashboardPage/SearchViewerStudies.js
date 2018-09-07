import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import { Link } from 'react-router-dom'
import StudyLink from 'components/StudyLink.js'
import SearchUserStudiesInput from 'components/SearchUserStudiesInput'
import {get} from 'utils'
import {SEARCH_BAR_RESULTS_PER_PAGE} from 'consts'

const SearchViewerStudiesQuery = graphql`
  query SearchViewerStudiesQuery($count: Int!, $after: String, $query: String!, $within: ID!) {
    ...SearchUserStudiesInput_query @arguments(count: $count, after: $after, query: $query, within: $within)
  }
`

class SearchViewerStudies extends React.Component {
  state = {
    error: null,
    hasMore: false,
    loadMore: () => {},
    q: "",
    studyEdges: [],
  }

  get classes() {
    const {className} = this.props
    return cls("SearchViewerStudies mdc-list mdc-list--non-interactive", className)
  }

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={SearchViewerStudiesQuery}
        variables={{
          count: SEARCH_BAR_RESULTS_PER_PAGE,
          query: "*",
          within: get(this.props, "viewer.id"),
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const {hasMore, loadMore, studyEdges} = this.state

            return (
              <div className={this.classes}>
                <div role="separator" className="mdc-list-divider"></div>
                <div className="mdc-list-item">
                  <div className="flex justify-between items-center w-100">
                    <span className="mdc-typography--subtitle1">Studies</span>
                    <Link className="mdc-button mdc-button--unelevated" to="/new">New</Link>
                  </div>
                </div>
                <div className="mdc-list-item">
                  <SearchUserStudiesInput
                    query={props}
                    user={get(this.props, "viewer", null)}
                    onQueryComplete={(studyEdges, hasMore, loadMore) =>
                      this.setState({hasMore, loadMore, studyEdges})
                    }
                  />
                </div>
                <div className="mdc-list">
                  {studyEdges.map((edge) => (
                    edge
                    ? <StudyLink
                        key={get(edge, "node.id", "")}
                        withOwner
                        className="mdc-list-item"
                        study={get(edge, "node", null)}
                      />
                    : null
                  ))}
                </div>
                {hasMore &&
                <button
                  className="mdc-button mdc-list-item w-100"
                  onClick={loadMore}
                >
                  Load more
                </button>}
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default createFragmentContainer(SearchViewerStudies, graphql`
  fragment SearchViewerStudies_viewer on User {
    id
    ...SearchUserStudiesInput_user
  }
`)

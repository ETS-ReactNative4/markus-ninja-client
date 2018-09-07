import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  createFragmentContainer,
  createRefetchContainer,
  graphql,
} from 'react-relay'
import { debounce, get, isNil, isEmpty } from 'utils'

class SearchUserStudiesInput extends React.Component {
  state = {
    error: null,
    loading: false,
    q: "",
  }

  componentDidMount() {
    this.props.onQueryComplete(
      get(this.props, "query.search.edges", []),
      this._hasMore,
      this._loadMore,
    )
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.loading && !this.state.loading) {
      this.props.onQueryComplete(
        get(this.props, "query.search.edges", []),
        this._hasMore,
        this._loadMore,
      )
    }
  }

  handleChange = (e) => {
    const q = e.target.value
    this.setState({
      q,
    })
    this._refetch(q)
  }

  _loadMore = () => {
    const { loading, q } = this.state
    const after = get(this.props, "query.search.pageInfo.endCursor")

    if (!this._hasMore()) {
      console.log("Nothing more to load")
      return
    } else if (loading) {
      console.log("Request is already pending")
      return
    }

    this._refetch(q, after)
  }

  _refetch = debounce((query, after) => {
    this.setState({
      loading: true,
    })
    this.props.onQuery(query)
    this.props.relay.refetch(
      {
        count: get(this.props, "count", 10),
        after,
        query: isEmpty(query) ? "*" : query,
        within: get(this.props, "user.id"),
      },
      null,
      (error) => {
        if (!isNil(error)) {
          console.log(error)
        }
        this.setState({ loading: false })
      },
      {force: true},
    )
  }, 300)

  get _hasMore() {
    return get(this.props, "query.search.pageInfo.hasNextPage", false)
  }

  get classes() {
    const {className} = this.props
    return cls("SearchUserStudiesInput h-100", className)
  }

  render() {
    const { q } = this.state

    return (
      <div className={this.classes}>
        <div className="mdc-text-field mdc-text-field--outlined w-100 mdc-text-field--inline mdc-text-field--with-trailing-icon">
          <input
            id="studies-query"
            className="mdc-text-field__input"
            autoComplete="off"
            type="text"
            name="q"
            placeholder="Find a study..."
            value={q}
            onChange={this.handleChange}
          />
          <div className="mdc-notched-outline mdc-theme--background z-behind">
            <svg>
              <path className="mdc-notched-outline__path"></path>
            </svg>
          </div>
          <div className="mdc-notched-outline__idle mdc-theme--background z-behind"></div>
          <i className="material-icons mdc-text-field__icon">
            search
          </i>
        </div>
      </div>
    )
  }
}

SearchUserStudiesInput.propTypes = {
  onQuery: PropTypes.func,
  onQueryComplete: PropTypes.func.isRequired,
}

SearchUserStudiesInput.defaultProps = {
  onQuery: () => {},
  onQueryComplete: () => {},
}

const refetchContainer = createRefetchContainer(SearchUserStudiesInput,
  {
    query: graphql`
      fragment SearchUserStudiesInput_query on Query
      @argumentDefinitions(count: {type: "Int!"}, after: {type: "String"}, query: {type: "String!"}, within: {type: "ID!"}) {
        search(first: $count, after: $after, query: $query, type: STUDY, within: $within)
        @connection(key: "SearchUserStudiesInput_search", filters: []) {
          edges {
            cursor
            node {
              id
              ...on Study {
                ...StudyLink_study
                ...UserStudyPreview_study
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
  },
  graphql`
    query SearchUserStudiesInputRefetchQuery ($count: Int!, $after: String, $query: String!, $within: ID!) {
      ...SearchUserStudiesInput_query @arguments(count: $count, after: $after, query: $query, within: $within)
    }
  `,
)

export default createFragmentContainer(refetchContainer, graphql`
  fragment SearchUserStudiesInput_user on User {
    id
  }
`)

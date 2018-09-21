import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import queryString from 'query-string'
import {withRouter} from 'react-router'
import Search from 'components/Search'
import StudySearchPageResults from './StudySearchPageResults'
import {debounce, get, isEmpty} from 'utils'

class StudySearchPage extends React.Component {
  constructor(props) {
    super(props)

    const searchQuery = queryString.parse(get(this.props, "location.search", ""))
    const q = get(searchQuery, "q", "")

    this.state = {q}
  }

  handleChange = (e) => {
    this.setState({q: e.target.value})
    this._redirect()
  }

  _redirect = debounce(() => {
    const {location, history} = this.props
    const {q} = this.state

    const searchQuery = queryString.parse(get(location, "search", ""))
    searchQuery.q = isEmpty(q) ? undefined : q

    const search = queryString.stringify(searchQuery)

    history.replace({pathname: location.pathname, search})
  }, 300)

  get classes() {
    const {className} = this.props
    return cls("StudySearchPage mdc-layout-grid__inner", className)
  }

  get _query() {
    const searchQuery = queryString.parse(get(this.props, "location.search", ""))
    const direction = get(searchQuery, "o", "desc").toUpperCase()
    const query = get(searchQuery, "q", "")
    const type = get(searchQuery, "t", "lesson").toUpperCase()
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
    const query = this._query
    const studyId = get(this.props, "study.id", "")

    return (
      <div className={this.classes}>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          {this.renderInput()}
        </div>
        <Search
          type={query.type}
          query={query.query}
          orderBy={query.orderBy}
          within={studyId}
        >
          <StudySearchPageResults />
        </Search>
      </div>
    )
  }

  renderInput() {
    const {q} = this.state

    return (
      <div className="mdc-text-field mdc-text-field--outlined w-100 mdc-text-field--inline mdc-text-field--with-trailing-icon">
        <input
          className="mdc-text-field__input"
          autoComplete="off"
          type="text"
          name="q"
          placeholder="Search..."
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
    )
  }
}

export default withRouter(createFragmentContainer(StudySearchPage, graphql`
  fragment StudySearchPage_study on Study {
    id
  }
`))

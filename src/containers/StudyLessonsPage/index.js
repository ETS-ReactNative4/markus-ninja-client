import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import queryString from 'query-string'
import StudyLabelsLink from 'components/StudyLabelsLink'
import CreateLessonLink from 'components/CreateLessonLink'
import Search from 'components/Search'
import StudyLessons from './StudyLessons'
import {debounce, get, isEmpty} from 'utils'

class StudyLessonsPage extends React.Component {
  constructor(props) {
    super(props)

    const searchQuery = queryString.parse(get(this.props, "location.search", ""))
    const {o, q, s} = searchQuery

    this.state = {o, q, s}
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

    history.push({pathname: location.pathname, search})
  }, 300)

  get classes() {
    const {className} = this.props
    return cls("StudyLessonsPage mdc-layout-grid__inner", className)
  }

  get _order() {
    const searchQuery = queryString.parse(get(this.props, "location.search", ""))
    const {s} = searchQuery
    switch (s) {
      case "asc":
        return "ASC"
      case "desc":
        return "DESC"
      default:
        return "ASC"
    }
  }

  get _sort() {
    const searchQuery = queryString.parse(get(this.props, "location.search", ""))
    const {o} = searchQuery
    switch (o) {
      case "created":
        return "CREATED_AT"
      case "comments":
        return "COMMENT_COUNT"
      case "number":
        return "NUMBER"
      case "updated":
        return "UPDATED_AT"
      default:
        return "NUMBER"
    }
  }

  render() {
    const study = get(this.props, "study", null)
    const {q} = this.state
    const orderBy = {
      direction: this._order,
      field: this._sort,
    }

    return (
      <div className={this.classes}>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <div className="flex items-center w-100">
            {this.renderInput()}
            <StudyLabelsLink
              className="mdc-button mdc-button--unelevated mh2"
              study={study}
            >
              Labels
            </StudyLabelsLink>
            {study.viewerCanAdmin &&
            <CreateLessonLink
              className="mdc-button mdc-button--unelevated flex-stable"
              study={study}
            >
              New lesson
            </CreateLessonLink>}
          </div>
        </div>
        <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
        <Search type="LESSON" query={q} within={study.id} orderBy={orderBy}>
          <StudyLessons study={study} />
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
          placeholder="Find a lesson..."
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

export default createFragmentContainer(StudyLessonsPage, graphql`
  fragment StudyLessonsPage_study on Study {
    ...CreateLessonLink_study
    ...StudyLabelsLink_study
    id
    viewerCanAdmin
  }
`)

import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import TextField, {Icon, Input} from '@material/react-text-field'
import queryString from 'query-string'
import StudyLabelsLink from 'components/StudyLabelsLink'
import CreateLessonLink from 'components/CreateLessonLink'
import StudyLessons from 'components/StudyLessons'
import StudyLessonsPageLessons from './StudyLessonsPageLessons'
import {debounce, get, isEmpty} from 'utils'

class StudyLessonsPage extends React.Component {
  constructor(props) {
    super(props)

    const searchQuery = queryString.parse(get(this.props, "location.search", ""))
    const {o, q, s} = searchQuery

    this.state = {o, q, s}
  }

  handleChange = (e) => {
    const q = e.target.value
    this.setState({q})
    this._redirect(q)
  }

  _redirect = debounce((q) => {
    const {location, history} = this.props

    const searchQuery = queryString.parse(get(location, "search", ""))
    searchQuery.q = isEmpty(q) ? undefined : q

    const search = queryString.stringify(searchQuery)

    history.replace({pathname: location.pathname, search})
  }, 300)

  get classes() {
    const {className} = this.props
    return cls("StudyLessonsPage mdc-layout-grid__inner", className)
  }

  get _filterBy() {
    const {q} = this.state
    return {search: q}
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
        return "ASC"
      }
    })()
    const field = (() => {
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
    })()

    return {direction, field}
  }

  render() {
    const study = get(this.props, "study", null)

    return (
      <div className={this.classes}>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <div className="rn-text-field">
            {this.renderInput()}
            <div className="rn-text-field__actions">
              <StudyLabelsLink
                className="mdc-button mdc-button--unelevated rn-text-field__action rn-text-field__action--button"
                study={study}
              >
                Labels
              </StudyLabelsLink>
              {study.viewerCanAdmin &&
              <CreateLessonLink
                className="mdc-button mdc-button--unelevated rn-text-field__action--button"
                study={study}
              >
                New lesson
              </CreateLessonLink>}
            </div>
          </div>
        </div>
        <StudyLessons filterBy={this._filterBy} orderBy={this._orderBy} fragment="list">
          <StudyLessonsPageLessons study={study} />
        </StudyLessons>
      </div>
    )
  }

  renderInput() {
    const {q} = this.state

    return (
      <TextField
        fullWidth
        label="Find a lesson..."
        trailingIcon={<Icon><i className="material-icons">search</i></Icon>}
      >
        <Input
          name="q"
          autoComplete="off"
          placeholder="Find a lesson..."
          value={q}
          onChange={this.handleChange}
        />
      </TextField>
    )
  }
}

export default createFragmentContainer(StudyLessonsPage, graphql`
  fragment StudyLessonsPage_study on Study {
    ...CreateLessonLink_study
    ...StudyLabelsLink_study
    resourcePath
    viewerCanAdmin
  }
`)

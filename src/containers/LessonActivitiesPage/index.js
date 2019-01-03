import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import TextField, {Icon, Input} from '@material/react-text-field'
import queryString from 'query-string'
import CreateLessonActivityLink from 'components/CreateLessonActivityLink'
import LessonActivities from 'components/LessonActivities'
import LessonActivitiesPageActivities from './LessonActivitiesPageActivities'
import {debounce, get, isEmpty} from 'utils'

class LessonActivitiesPage extends React.Component {
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
    return cls("LessonActivitiesPage mdc-layout-grid", className)
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
    const {lesson} = this.props

    return (
      <div className={this.classes}>
        <div className="mdc-layout-grid__inner mw8">
          {lesson.isPublished
          ? <React.Fragment>
              <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                <div className="rn-text-field">
                  <div className="rn-text-field__input">
                    {this.renderInput()}
                  </div>
                  <div className="rn-text-field__actions">
                    <CreateLessonActivityLink
                      className="mdc-button mdc-button--unelevated rn-text-field__action rn-text-field__action--button"
                      lesson={lesson}
                    >
                      New activity
                    </CreateLessonActivityLink>
                  </div>
                </div>
              </div>
              <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                <LessonActivities filterBy={this._filterBy} orderBy={this._orderBy} fragment="list">
                  <LessonActivitiesPageActivities />
                </LessonActivities>
              </div>
            </React.Fragment>
          : <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              Lessons must be published to have activities.
            </div>}
        </div>
      </div>
    )
  }

  renderInput() {
    const {q} = this.state

    return (
      <TextField
        fullWidth
        label="Find an activity..."
        trailingIcon={<Icon><i className="material-icons">search</i></Icon>}
      >
        <Input
          name="q"
          autoComplete="off"
          placeholder="Find an activity..."
          value={q}
          onChange={this.handleChange}
        />
      </TextField>
    )
  }
}

export default createFragmentContainer(LessonActivitiesPage, graphql`
  fragment LessonActivitiesPage_lesson on Lesson {
    ...CreateLessonActivityLink_lesson
    isPublished
    resourcePath
  }
`)

import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import queryString from 'query-string'
import CreateCourseLink from 'components/CreateCourseLink'
import Search from 'components/Search'
import StudyCourses from './StudyCourses'
import {debounce, get, isEmpty} from 'utils'

class StudyCoursesPage extends React.Component {
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

    history.push({pathname: location.pathname, search})
  }, 300)

  get classes() {
    const {className} = this.props
    return cls("StudyCoursesPage mdc-layout-grid__inner", className)
  }

  render() {
    const {q} = this.state
    const study = get(this.props, "study", null)

    return (
      <div className={this.classes}>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <div className="inline-flex items-center w-100">
            {this.renderInput()}
            <div className="flex-stable ml2">
              <CreateCourseLink
                className="mdc-button mdc-button--unelevated"
                study={study}
              >
                New course
              </CreateCourseLink>
            </div>
          </div>
        </div>
        <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
        <Search type="COURSE" query={q} within={study.id}>
          <StudyCourses study={study} />
        </Search>
      </div>
    )
  }

  renderInput() {
    const {q} = this.state

    return (
      <div className="mdc-text-field mdc-text-field--outlined w-100 mdc-text-field--inline mdc-text-field--with-trailing-icon">
        <input
          id="courses-query"
          className="mdc-text-field__input"
          autoComplete="off"
          type="text"
          name="q"
          placeholder="Find a course..."
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

export default createFragmentContainer(StudyCoursesPage, graphql`
  fragment StudyCoursesPage_study on Study {
    id
    ...CreateCourseLink_study
  }
`)

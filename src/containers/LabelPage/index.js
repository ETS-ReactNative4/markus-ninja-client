import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import TextField, {Icon, Input} from '@material/react-text-field'
import queryString from 'query-string'
import StudyLabelsLink from 'components/StudyLabelsLink'
import StudyLessons from 'components/StudyLessons'
import LabelPageLessons from './LabelPageLessons'
import {debounce, get, isEmpty} from 'utils'

class LabelPage extends React.Component {
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
    return cls("LabelPage mdc-layout-grid__inner", className)
  }

  get _filterBy() {
    const {match} = this.props
    const {q} = this.state
    return {
      search: q,
      labels: [match.params.label],
    }
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
          <div className="flex items-center w-100">
            {this.renderInput()}
            <StudyLabelsLink
              className="mdc-button mdc-button--unelevated mh2"
              study={study}
            >
              Labels
            </StudyLabelsLink>
          </div>
        </div>
        <StudyLessons filterBy={this._filterBy} orderBy={this._orderBy}>
          <LabelPageLessons />
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

export default createFragmentContainer(LabelPage, graphql`
  fragment LabelPage_study on Study {
    ...StudyLabelsLink_study
    viewerCanAdmin
  }
`)

import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import TextField, {Icon, Input} from '@material/react-text-field'
import queryString from 'query-string'
import {Link, withRouter} from 'react-router-dom'
import UserStudies from 'components/UserStudies'
import UserStudiesTabStudies from './UserStudiesTabStudies'
import {debounce, get, isEmpty} from 'utils'

class UserStudiesTab extends React.Component {
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
    return cls("UserStudiesTab mdc-layout-grid__inner", className)
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
      case "advanced":
        return "ADVANCED_AT"
      case "created":
        return "CREATED_AT"
      case "lessons":
        return "LESSON_COUNT"
      case "NAME":
        return "NAME"
      case "updated":
        return "UPDATED_AT"
      default:
        return "ADVANCED_AT"
      }
    })()

    return {direction, field}
  }

  render() {
    return (
      <div className={this.classes}>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <div className="flex items-center w-100">
            {this.renderInput()}
            <Link className="mdc-button mdc-button--unelevated ml3" to="/new">New</Link>
          </div>
        </div>
        <UserStudies filterBy={this._filterBy} orderBy={this._orderBy}>
          <UserStudiesTabStudies />
        </UserStudies>
      </div>
    )
  }

  renderInput() {
    const {q} = this.state

    return (
      <TextField
        fullWidth
        label="Find a study..."
        trailingIcon={<Icon><i className="material-icons">search</i></Icon>}
      >
        <Input
          name="q"
          autoComplete="off"
          placeholder="Find a study..."
          value={q}
          onChange={this.handleChange}
        />
      </TextField>
    )
  }
}

export default withRouter(createFragmentContainer(UserStudiesTab, graphql`
  fragment UserStudiesTab_user on User {
    isViewer
  }
`))

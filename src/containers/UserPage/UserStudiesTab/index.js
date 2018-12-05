import * as React from 'react'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
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
    const user = get(this.props, "user", {})

    return (
      <React.Fragment>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <div className="rn-text-field">
            <div className="rn-text-field__input">
              {this.renderInput()}
            </div>
            {user.isViewer &&
            <div className="rn-text-field__actions">
              <Link className="mdc-button mdc-button--unelevated" to="/new">New study</Link>
            </div>}
          </div>
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <UserStudies filterBy={this._filterBy} orderBy={this._orderBy}>
            <UserStudiesTabStudies user={user} />
          </UserStudies>
        </div>
      </React.Fragment>
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

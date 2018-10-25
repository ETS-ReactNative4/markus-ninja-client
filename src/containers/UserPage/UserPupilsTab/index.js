import * as React from 'react'
import TextField, {Icon, Input} from '@material/react-text-field'
import queryString from 'query-string'
import {withRouter} from 'react-router-dom'
import UserEnrollees from 'components/UserEnrollees'
import UserPupilsTabPupils from './UserPupilsTabPupils'
import {debounce, get, isEmpty} from 'utils'

class UserPupilsTab extends React.Component {
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
        return "DESC"
      }
    })()
    const field = (() => {
      switch (o) {
      case "enrolled":
        return "ENROLLED_AT"
      default:
        return "ENROLLED_AT"
      }
    })()

    return {direction, field}
  }

  render() {
    return (
      <React.Fragment>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          {this.renderInput()}
        </div>
        <UserEnrollees filterBy={this._filterBy} orderBy={this._orderBy}>
          <UserPupilsTabPupils />
        </UserEnrollees>
      </React.Fragment>
    )
  }

  renderInput() {
    const {q} = this.state

    return (
      <TextField
        fullWidth
        label="Find a pupil..."
        trailingIcon={<Icon><i className="material-icons">search</i></Icon>}
      >
        <Input
          name="q"
          autoComplete="off"
          placeholder="Find a pupil..."
          value={q}
          onChange={this.handleChange}
        />
      </TextField>
    )
  }
}

export default withRouter(UserPupilsTab)

import * as React from 'react'
import TextField, {Icon, Input} from '@material/react-text-field'
import queryString from 'query-string'
import {withRouter} from 'react-router-dom'
import UserEnrolled from 'components/UserEnrolled'
import UserTutorsTabTutors from './UserTutorsTabTutors'
import {debounce, get, isEmpty} from 'utils'

class UserTutorsTab extends React.Component {
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
    const {q} = this.state

    return (
      <React.Fragment>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          {this.renderInput()}
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <UserEnrolled orderBy={this._orderBy} search={q} type="USER">
            <UserTutorsTabTutors />
          </UserEnrolled>
        </div>
      </React.Fragment>
    )
  }

  renderInput() {
    const {q} = this.state

    return (
      <TextField
        fullWidth
        label="Find a tutor..."
        trailingIcon={<Icon><i className="material-icons">search</i></Icon>}
      >
        <Input
          name="q"
          autoComplete="off"
          placeholder="Find a tutor..."
          value={q}
          onChange={this.handleChange}
        />
      </TextField>
    )
  }
}

export default withRouter(UserTutorsTab)

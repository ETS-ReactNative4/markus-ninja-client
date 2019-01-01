import * as React from 'react'
import TextField, {Icon, Input} from '@material/react-text-field'
import queryString from 'query-string'
import UserAssets from 'components/UserAssets'
import UserAssetsTabAssets from './UserAssetsTabAssets'
import {debounce, get, isEmpty} from 'utils'

class UserAssetsTab extends React.Component {
  constructor(props) {
    super(props)

    const searchQuery = queryString.parse(get(this.props, "location.search", ""))
    const {o, q, s} = searchQuery

    this.state = {
      o,
      q,
      s,
    }
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
      case "created":
        return "CREATED_AT"
      case "name":
        return "NAME"
      case "updated":
        return "UPDATED_AT"
      default:
        return "NAME"
      }
    })()

    return {direction, field}
  }

  render() {
    return (
      <React.Fragment>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <div className="flex items-center w-100">
            {this.renderInput()}
          </div>
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <UserAssets filterBy={this._filterBy} orderBy={this._orderBy} fragment="list">
            <UserAssetsTabAssets />
          </UserAssets>
        </div>
      </React.Fragment>
    )
  }

  renderInput() {
    const {q} = this.state

    return (
      <TextField
        fullWidth
        label="Find an asset..."
        trailingIcon={<Icon><i className="material-icons">search</i></Icon>}
      >
        <Input
          name="q"
          autoComplete="off"
          placeholder="Find an asset..."
          value={q}
          onChange={this.handleChange}
        />
      </TextField>
    )
  }
}

export default UserAssetsTab

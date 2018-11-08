import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import TextField, {Icon, Input} from '@material/react-text-field'
import queryString from 'query-string'
import StudyAssets from 'components/StudyAssets'
import StudyAssetsPageAssets from './StudyAssetsPageAssets'
import {debounce, get, isEmpty} from 'utils'

import Context from 'containers/StudyPage/Context'

import "./styles.css"

class StudyAssetsPage extends React.Component {
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
    return cls("StudyAssetsPage mdc-layout-grid__inner", className)
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
    const {toggleCreateUserAssetDialog} = this.context
    const study = get(this.props, "study", null)

    return (
      <div className={this.classes}>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <div className="rn-text-field">
            {this.renderInput()}
            <div className="rn-text-field__actions">
              {study.viewerCanAdmin &&
                <button
                  className="mdc-button mdc-button--unelevated rn-text-field__action rn-text-field__action--button"
                  type="button"
                  onClick={toggleCreateUserAssetDialog}
                >
                  New asset
                </button>}
            </div>
          </div>
        </div>
        <StudyAssets filterBy={this._filterBy} orderBy={this._orderBy}>
          <StudyAssetsPageAssets study={study} />
        </StudyAssets>
      </div>
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

StudyAssetsPage.contextType = Context

export default createFragmentContainer(StudyAssetsPage, graphql`
  fragment StudyAssetsPage_study on Study {
    ...CreateUserAssetDialog_study
    id
    viewerCanAdmin
  }
`)

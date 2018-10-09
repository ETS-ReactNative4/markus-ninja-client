import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import TextField, {Icon, Input} from '@material/react-text-field'
import queryString from 'query-string'
import CreateUserAssetForm from 'components/CreateUserAssetForm'
import StudyAssets from 'components/StudyAssets'
import StudyAssetsPageAssets from './StudyAssetsPageAssets'
import {debounce, get, isEmpty} from 'utils'

class StudyAssetsPage extends React.Component {
  constructor(props) {
    super(props)

    const searchQuery = queryString.parse(get(this.props, "location.search", ""))
    const {o, q, s} = searchQuery

    this.state = {
      open: false,
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
    const {open} = this.state
    const study = get(this.props, "study", null)

    return (
      <div className={this.classes}>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <div className="flex items-center w-100">
            {this.renderInput()}
            {study.viewerCanAdmin &&
              <button
                className="mdc-button mdc-button--unelevated flex-stable ml2"
                type="button"
                onClick={() => this.setState({open: !open})}
              >
                New asset
              </button>}
          </div>
        </div>
        {open && study.viewerCanAdmin &&
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <div className="flex items-start">
            <CreateUserAssetForm
              study={study}
              onCancel={() => this.setState({open: false})}
            />
          </div>
        </div>}
        <StudyAssets filterBy={this._filterBy} orderBy={this._orderBy}>
          <StudyAssetsPageAssets />
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

export default createFragmentContainer(StudyAssetsPage, graphql`
  fragment StudyAssetsPage_study on Study {
    ...CreateUserAssetForm_study
    id
    viewerCanAdmin
  }
`)

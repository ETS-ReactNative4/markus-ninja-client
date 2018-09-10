import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import queryString from 'query-string'
import SearchStudyRefetch from 'components/SearchStudyRefetch'
import StudyAssets from './StudyAssets'
import {debounce, get, isEmpty} from 'utils'

class StudyAssetsPage extends React.Component {
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
    return cls("StudyAssetsPage mdc-layout-grid__inner", className)
  }

  render() {
    const {q} = this.state
    const study = get(this.props, "study", null)

    return (
      <div className={this.classes}>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <div className="inline-flex items-center w-100">
            {this.renderInput()}
          </div>
        </div>
        <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <SearchStudyRefetch study={study} type="USER_ASSET" query={q}>
            <StudyAssets />
          </SearchStudyRefetch>
        </div>
      </div>
    )
  }

  renderInput() {
    const {q} = this.state

    return (
      <div className="mdc-text-field mdc-text-field--outlined w-100 mdc-text-field--inline mdc-text-field--with-trailing-icon">
        <input
          className="mdc-text-field__input"
          autoComplete="off"
          type="text"
          name="q"
          placeholder="Find a asset..."
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

export default createFragmentContainer(StudyAssetsPage, graphql`
  fragment StudyAssetsPage_study on Study {
    ...SearchStudyRefetch_study
  }
`)

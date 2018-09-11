import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import Search from 'components/Search'
import ViewerStudies from './ViewerStudies'
import {get} from 'utils'

class SearchViewerStudies extends React.Component {
  state = {
    error: null,
    q: "",
  }

  handleChange = (e) => {
    this.setState({q: e.target.value})
  }

  get classes() {
    const {className} = this.props
    return cls("SearchViewerStudies mdc-list mdc-list--non-interactive", className)
  }

  render() {
    const {q} = this.state
    const viewerId = get(this.props, "viewer.id", "")

    return (
      <div className={this.classes}>
        <div role="separator" className="mdc-list-divider"></div>
        <div className="mdc-list-item">
          <div className="flex justify-between items-center w-100">
            <span className="mdc-typography--subtitle1">Studies</span>
            <Link className="mdc-button mdc-button--unelevated" to="/new">New</Link>
          </div>
        </div>
        <div className="mdc-list-item">
          {this.renderInput()}
        </div>
        <Search type="STUDY" query={q} within={viewerId}>
          <ViewerStudies />
        </Search>
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
          placeholder="Find a study..."
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

export default createFragmentContainer(SearchViewerStudies, graphql`
  fragment SearchViewerStudies_viewer on User {
    id
  }
`)

import * as React from 'react'
import cls from 'classnames'
import { Link } from 'react-router-dom'
import UserStudies from 'components/UserStudies'
import ViewerStudies from './ViewerStudies'

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

  get _filterBy() {
    const {q} = this.state
    return {search: q}
  }

  render() {
    return (
      <div className={this.classes}>
        <div role="separator" className="mdc-list-divider"></div>
        <div className="mdc-list-item">
          <div className="flex justify-between items-center w-100">
            <h6>Studies</h6>
            <Link className="mdc-button mdc-button--unelevated" to="/new">New</Link>
          </div>
        </div>
        <div className="mdc-list-item">
          {this.renderInput()}
        </div>
        <UserStudies isViewer fragment="link" count={3} filterBy={this._filterBy}>
          <ViewerStudies />
        </UserStudies>
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

export default SearchViewerStudies

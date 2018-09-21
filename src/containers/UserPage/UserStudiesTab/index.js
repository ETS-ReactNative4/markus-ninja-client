import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import Search from 'components/Search'
import StudySearchResults from 'components/StudySearchResults'
import {get} from 'utils'

class UserStudiesTab extends React.Component {
  state = {
    q: "",
  }

  handleChange = (e) => {
    this.setState({q: e.target.value})
  }

  get classes() {
    const {className} = this.props
    return cls("UserStudiesTab mdc-layout-grid__inner", className)
  }

  render() {
    const {q} = this.state
    const userId = get(this.props, "user.id", "")

    return (
      <div className={this.classes}>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <div className="flex items-center w-100">
            {this.renderInput()}
            <Link className="mdc-button mdc-button--unelevated ml3" to="/new">New</Link>
          </div>
        </div>
        <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
        <Search type="STUDY" query={q} within={userId}>
          <StudySearchResults />
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

export default withRouter(createFragmentContainer(UserStudiesTab, graphql`
  fragment UserStudiesTab_user on User {
    id
    isViewer
  }
`))

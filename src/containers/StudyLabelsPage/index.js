import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import queryString from 'query-string'
import CreateLabelForm from 'components/CreateLabelForm'
import Search from 'components/Search'
import StudyLabels from './StudyLabels'
import {debounce, get, isEmpty} from 'utils'

class StudyLabelsPage extends React.Component {
  state = {
    q: "",
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
    return cls("StudyLabelsPage mdc-layout-grid__inner", className)
  }

  render() {
    const {q} = this.state
    const study = get(this.props, "study", null)

    return (
      <div className={this.classes}>
        {this.renderInput()}

        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <CreateLabelForm study={study} />
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <Search
            type="LABEL"
            query={q}
            within={study.id}
          >
            <StudyLabels />
          </Search>
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
          placeholder="Search..."
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

export default createFragmentContainer(StudyLabelsPage, graphql`
  fragment StudyLabelsPage_study on Study {
    id
    ...CreateLabelForm_study
  }
`)

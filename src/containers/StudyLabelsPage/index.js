import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import TextField, {Icon, Input} from '@material/react-text-field'
import queryString from 'query-string'
import StudyLabels from 'components/StudyLabels'
import StudyLabelsPageLabels from './StudyLabelsPageLabels'
import CreateLabelDialog from './CreateLabelDialog'
import {debounce, get, isEmpty} from 'utils'

import "./styles.css"

class StudyLabelsPage extends React.Component {
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
    return cls("StudyLabelsPage mdc-layout-grid__inner", className)
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
      case "labeled":
        return "LABELED_AT"
      case "name":
        return "NAME"
      default:
        return "NAME"
      }
    })()

    return {direction, field}
  }

  render() {
    const {open} = this.state
    const study = get(this.props, "study", {})

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
              New label
            </button>}
          </div>
        </div>
        <StudyLabels filterBy={this._filterBy} orderBy={this._orderBy}>
          <StudyLabelsPageLabels onAddAction={() => this.setState({open: !open})}/>
        </StudyLabels>
        {study.viewerCanAdmin &&
        <CreateLabelDialog
          open={open}
          study={get(this.props, "study", null)}
          onClose={() => this.setState({open: false})}
        />}
      </div>
    )
  }

  renderInput() {
    const {q} = this.state

    return (
      <TextField
        fullWidth
        label="Find a label..."
        trailingIcon={<Icon><i className="material-icons">search</i></Icon>}
      >
        <Input
          name="q"
          autoComplete="off"
          placeholder="Find a label..."
          value={q}
          onChange={this.handleChange}
        />
      </TextField>
    )
  }
}

export default createFragmentContainer(StudyLabelsPage, graphql`
  fragment StudyLabelsPage_study on Study {
    ...CreateLabelDialog_study
    id
    viewerCanAdmin
  }
`)

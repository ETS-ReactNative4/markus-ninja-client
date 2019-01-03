import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import TextField, {Icon, Input} from '@material/react-text-field'
import Dialog from 'components/Dialog'
import UserStudies from 'components/UserStudies'
import StudyPreview from 'components/StudyPreview'
import {isEmpty} from 'utils'

class Studies extends React.Component {
  state = {
    study: {},
  }

  handleSelect = (study) => {
    this.setState({study})
    this.props.onSelect(study)
  }

  render() {
    const {study} = this.state
    const {studies} = this.props
    const {dataIsStale, edges, isLoading} = studies
    const noResults = isEmpty(edges)

    return (
      <ul className="mdc-list">
        {isLoading && (dataIsStale || noResults)
        ? <li className="mdc-list-item">Loading...</li>
        : noResults
          ? <li className="mdc-list-item">No studies found</li>
        : edges.map(({node}) => (
            node &&
            <StudyPreview.Select
              key={node.id}
              study={node}
              selected={study.id === node.id}
              onClick={this.handleSelect}
            />
          ))}
      </ul>
    )
  }
}

Studies.propTypes = {
  onSelect: PropTypes.func.isRequired,
}

Studies.defaultProps = {
  onSelect: () => {},
}

class ActivityStudyDialog extends React.Component {
  state = {
    studiesFetched: false,
    loading: false,
    query: "",
  }

  componentDidUpdate(prevProps) {
    const {studiesFetched} = this.state
    if (!studiesFetched && !prevProps.open && this.props.open) {
      this.setState({studiesFetched: true})
    }
  }

  handleClose = () => {
    this.setState({query: ""})
    this.props.onClose()
  }

  handleChange = (e) => {
    this.setState({
      query: e.target.value,
    })
  }

  handleSelectStudy = (study) => {
    this.props.onSelect(study)
  }

  get classes() {
    const {className} = this.props
    return cls("ActivityStudyDialog", className)
  }

  get isLoading() {
    return this.state.loading
  }

  get filterBy_() {
    const {q} = this.state
    return {search: q}
  }

  render() {
    const {studiesFetched} = this.state
    const {open} = this.props

    return (
      <Dialog
        className={this.classes}
        open={open}
        onClose={this.handleClose}
        title={
          <Dialog.Title>
            Select a study for your activity
          </Dialog.Title>}
        content={
          <Dialog.Content>
            {this.renderInput()}
            {(open || studiesFetched) &&
            <UserStudies
              isViewer
              filterBy={this.filterBy_}
              fragment="select"
            >
              <Studies onSelect={this.handleSelectStudy} />
            </UserStudies>}
          </Dialog.Content>}
        actions={
          <Dialog.Actions>
            <button
              type="button"
              className="mdc-button mdc-button--unelevated"
              data-mdc-dialog-action="ok"
            >
              Ok
            </button>
          </Dialog.Actions>}
      />
    )
  }

  renderInput() {
    const {query} = this.state

    return (
      <TextField
        fullWidth
        label="Find a study..."
        trailingIcon={<Icon><i className="material-icons">search</i></Icon>}
      >
        <Input
          name="query"
          autoComplete="off"
          placeholder="Find a study..."
          value={query}
          onChange={this.handleChange}
        />
      </TextField>
    )
  }
}

ActivityStudyDialog.propTypes = {
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
}

ActivityStudyDialog.defaultProps = {
  onClose: () => {},
  onSelect: () => {},
}

export default ActivityStudyDialog

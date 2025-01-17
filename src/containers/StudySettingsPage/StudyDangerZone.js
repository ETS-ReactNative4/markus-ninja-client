import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { withRouter } from 'react-router'
import getHistory from 'react-router-global-history'
import TextField, {Input} from '@material/react-text-field'
import ErrorText from 'components/ErrorText'
import DeleteStudyMutation from 'mutations/DeleteStudyMutation'

class StudyDangerZone extends React.Component {
  state = {
    confirmation: "",
    error: null,
    open: false,
  }

  handleSubmit = (e) => {
    e.preventDefault()
    if (this.state.confirmation === 'delete me') {
      DeleteStudyMutation(
        this.props.study.id,
        (response, errors) => {
          if (errors) {
            this.setState({ error: errors[0].message })
          } else {
            getHistory().push("/")
          }
        },
      )
    }
  }

  handleToggleOpen = () => {
    this.setState({
      open: !this.state.open,
    })
  }

  get classes() {
    const {className} = this.props
    return cls("StudyDangerZone mdc-layout-grid__inner", className)
  }

  render() {
    const {open} = this.state

    return (
      <div className={this.classes}>
        <h6 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          Delete this study
        </h6>
        {open
        ? this.renderForm()
        : this.renderInfo()}
      </div>
    )
  }

  renderForm() {
    const {confirmation, error} = this.state

    return (
      <form className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12" onSubmit={this.handleSubmit}>
        <div className="mdc-layout-grid__inner">
          <p className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            Please enter 'delete me' to confirm
          </p>
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <TextField label="Confirmation">
              <Input
                name="confirmation"
                value={confirmation}
                required
                pattern="delete me"
                onChange={(e) => this.setState({ confirmation: e.target.value })}
              />
            </TextField>
          </div>
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <button
              type="submit"
              className="mdc-button mdc-button--unelevated"
            >
              Delete
            </button>
            <button
              className="mdc-button ml2"
              type="button"
              onClick={this.handleToggleOpen}
            >
              Cancel
            </button>
          </div>
          <ErrorText
            className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
            error={error}
          />
        </div>
      </form>
    )
  }

  renderInfo() {
    return (
      <React.Fragment>
        <p className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          Once you delete a study, there is no going back. Please be certain.
        </p>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <button
            className="mdc-button mdc-button--unelevated"
            type="button"
            onClick={this.handleToggleOpen}
          >
            Delete this study
          </button>
        </div>
      </React.Fragment>
    )
  }
}

export default withRouter(createFragmentContainer(StudyDangerZone, graphql`
  fragment StudyDangerZone_study on Study {
    id
  }
`))

import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import TextField, {Input} from '@material/react-text-field'
import DeleteStudyMutation from 'mutations/DeleteStudyMutation'
import { isNil } from 'utils'

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
          if (!isNil(errors)) {
            this.setState({ error: errors[0].message })
          } else {
            this.props.history.push("/")
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
        {open
        ? this.renderForm()
        : this.renderInfo()}
      </div>
    )
  }

  renderForm() {
    const {confirmation} = this.state

    return (
      <form className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12" onSubmit={this.handleSubmit}>
        <div className="mdc-layout-grid__inner">
          <p className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            Please enter 'delete me' to confirm
          </p>
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <TextField
              outlined
              label="Confirmation"
            >
              <Input
                name="confirmation"
                value={confirmation}
                onChange={(e) => this.setState({ confirmation: e.target.value })}
              />
            </TextField>
          </div>
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <button
              className="mdc-button mdc-button--unelevated"
              type="submit"
              disabled={confirmation !== "delete me"}
            >
              Delete
            </button>
            <button
              className="mdc-button mdc-button--unelevated ml2"
              type="button"
              onClick={this.handleToggleOpen}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    )
  }

  renderInfo() {
    return (
      <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
        <h6>Delete this study</h6>
        <p>Once you delete a study, there is no going back. Please be certain.</p>
        <button
          className="mdc-button mdc-button--unelevated"
          type="button"
          onClick={this.handleToggleOpen}
        >
          Delete this study
        </button>
      </div>
    )
  }
}

export default withRouter(createFragmentContainer(StudyDangerZone, graphql`
  fragment StudyDangerZone_study on Study {
    id
  }
`))

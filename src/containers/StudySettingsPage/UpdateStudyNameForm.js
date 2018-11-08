import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import {withRouter} from 'react-router-dom'
import {HelperText} from '@material/react-text-field'
import ErrorText from 'components/ErrorText'
import TextField, {defaultTextFieldState} from 'components/TextField'
import UpdateStudyMutation from 'mutations/UpdateStudyMutation'
import {get, isEmpty, replaceAll} from 'utils'

const defaultState = {
  error: null,
  name: defaultTextFieldState,
}

class UpdateStudyNameForm extends React.Component {
  constructor(props) {
    super(props)

    const value = get(this.props, "study.name", "")

    this.state = {
      ...defaultState,
      name: {
        ...defaultState.name,
        initialValue: value,
        value,
        valid: true,
      }
    }
  }

  handleChange = (field) => {
    this.setState({
      error: null,
      [field.name]: field,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { name } = this.state
    UpdateStudyMutation(
      this.props.study.id,
      null,
      name.value,
      (updateStudy, errors) => {
        if (errors) {
          this.setState({ error: errors[0].message })
          return
        }
        const value = get(updateStudy, "name", "")
        this.setState({
          error: null,
          name: {
            ...defaultState.name,
            initialValue: value,
            value,
            valid: true,
          }
        })
        this.props.history.push(updateStudy.resourcePath+"/settings")
      },
    )
  }

  get classes() {
    const {className} = this.props
    const {open} = this.state
    return cls("UpdateStudyNameForm", className, {
      open,
    })
  }

  render() {
    const {error, name} = this.state

    return (
      <form className={this.classes} onSubmit={this.handleSubmit}>
        <TextField
          className="rn-form__input"
          label="Study name"
          floatingLabelClassName="mdc-floating-label--float-above"
          helperText={
            <HelperText persistent>
              {!isEmpty(name.value) && name.dirty
              ? `Name will be ${replaceAll(name.value, " ", "_")}`
              : ""}
            </HelperText>
          }
          inputProps={{
            name: "name",
            value: name.value,
            required: true,
            maxLength: 39,
            onChange: this.handleChange,
          }}
        />
        <button
          type="submit"
          className="mdc-button mdc-button--unelevated mt2"
          disabled={!this.state.dirty}
        >
          Rename
        </button>
        <div className="mt2">
          <ErrorText error={error} />
        </div>
      </form>
    )
  }
}

export default withRouter(createFragmentContainer(UpdateStudyNameForm, graphql`
  fragment UpdateStudyNameForm_study on Study {
    id
    name
  }
`))

import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router-dom';
import TextField, {Input, HelperText} from '@material/react-text-field'
import Textarea from 'components/mdc/Textarea'
import CreateStudyMutation from 'mutations/CreateStudyMutation'
import { get, isEmpty } from 'utils'

class CreateStudyForm extends React.Component {
  state = {
    error: null,
    description: "",
    name: "",
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { description, name } = this.state
    CreateStudyMutation(
      name,
      description,
      (study, errors) => {
        if (!isEmpty(errors)) {
          this.setState({ error: errors[0].message })
        }
        this.props.history.push(get(study, "resourcePath", ""))
      }
    )
  }

  get classes() {
    const {className} = this.props
    return cls("CreateStudyForm", className)
  }

  render() {
    const owner = get(this.props, "user.login", "")
    const { name, description, error } = this.state
    return (
      <form className={this.classes} onSubmit={this.handleSubmit}>
        <div className="mdc-layout-grid__inner">
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-8-desktop mdc-layout-grid__cell--span-8-tablet">
            <div className="inline-flex items-center">
              <TextField
                outlined
                label="Owner"
                floatingLabelClassName="mdc-floating-label--float-above"
              >
                <Input
                  value={owner}
                  disabled
                />
              </TextField>
              <span className="mdc-typography--headline6 mh2">/</span>
              <TextField outlined label="Study name">
                <Input
                  name="name"
                  value={name}
                  onChange={this.handleChange}
                />
              </TextField>
            </div>
          </div>
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <TextField
              textarea
              label="Description (optional)"
              helperText={<HelperText>Give a brief description of the study.</HelperText>}
            >
              <Textarea
                name="description"
                value={description}
                onChange={this.handleChange}
              />
            </TextField>
          </div>
          <div className="mdc-layout-grid__cell">
            <button className="mdc-button mdc-button--unelevated" type="submit">Create study</button>
          </div>
          <span>{error}</span>
        </div>
      </form>
    )
  }
}

export default withRouter(createFragmentContainer(CreateStudyForm, graphql`
  fragment CreateStudyForm_user on User {
    login
  }
`))

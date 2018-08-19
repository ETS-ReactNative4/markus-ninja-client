import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import cls from 'classnames'
import { withRouter } from 'react-router-dom';
import CreateStudyMutation from 'mutations/CreateStudyMutation'
import { get, isEmpty } from 'utils'

class CreateStudyForm extends React.Component {
  state = {
    error: null,
    description: "",
    name: "",
  }

  render() {
    const owner = get(this.props, "user.login", "")
    const { name, description, error } = this.state
    return (
      <form
        className={cls("CreateStudyForm", "flex flex-column items-start")}
        onSubmit={this.handleSubmit}
      >
        <div className="inline-flex">
          <div className="inline-block relative mb2">
            <div className="mdc-typography--headline6">Owner</div>
            <div className="pt3">{owner}</div>
          </div>
          <div className="mdc-typography--headline6 self-end mh2">/</div>
          <div className="mdc-text-field">
            <label className="db mdc-typography--headline6" htmlFor="study-name">Study name</label>
            <input
              id="study-name"
              className="mdc-text-field__input"
              type="text"
              name="name"
              value={name}
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="mdc-text-field w-100">
          <label htmlFor="study-description">
            <span className="mdc-typography--headline6">Description</span>
            <span className="mdc-typography--subtitle1 ml1">(optional)</span>
          </label>
          <input
            id="study-description"
            className="mdc-text-field__input"
            type="text"
            name="description"
            value={description}
            onChange={this.handleChange}
          />
        </div>
        <button className="mdc-button mdc-button--unelevated" type="submit">Create study</button>
        <span>{error}</span>
      </form>
    )
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
}

export default withRouter(createFragmentContainer(CreateStudyForm, graphql`
  fragment CreateStudyForm_user on User {
    login
  }
`))

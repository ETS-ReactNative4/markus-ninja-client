import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router-dom';
import TextField, {Input} from '@material/react-text-field'
import { GithubPicker } from 'react-color'
import CreateLabelMutation from 'mutations/CreateLabelMutation'
import { isNil } from 'utils'

import "./styles.css"

class CreateLabelForm extends React.Component {
  constructor(props) {
    super(props)

    this.colorInput = React.createRef()
    this.state = {
      error: null,
      color: "",
      description: "",
      name: "",
      focusColorInput: false,
    }
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleChangeComplete = (color, event) => {
    this.setState({
      color: color.hex,
      focusColorInput: false,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { color, description, name } = this.state
    CreateLabelMutation(
      this.props.study.id,
      name,
      description,
      color,
      (response, error) => {
        if (!isNil(error)) {
          this.setState({ error: error[0].message })
        }
      },
    )
  }

  handleClick = (e) => {
    if (!this.colorInput.current.contains(e.target)) {
      this.setState({ focusColorInput: false })
    }
  }

  handleBlurColorInput = (e) => {
    setTimeout(() => {
      if (!this.colorInput.current.contains(document.activeElement)) {
        this.setState({ focusColorInput: false })
      }
    }, 0);
  }

  get classes() {
    const {className} = this.props
    return cls("CreateLabelForm", className)
  }

  render() {
    const {color, description, focusColorInput, name} = this.state
    return (
      <form
        className={this.classes}
        onSubmit={this.handleSubmit}
      >
        <div className="flex items-center flex-wrap">
          <div className="inline-flex flex-column mr2">
            <div className="inline-flex flex-wrap">
              <TextField
                className="mr2 mb2"
                outlined
                label="Label name"
              >
                <Input
                  name="name"
                  value={name}
                  onChange={this.handleChange}
                />
              </TextField>
              <div ref={this.colorInput} className="CreateLabelForm__color-input mb2">
                <TextField
                  outlined
                  label="Color"
                >
                  <Input
                    name="color"
                    value={color}
                    onChange={this.handleChange}
                    onFocus={() => this.setState({focusColorInput: true})}
                    onBlur={this.handleBlurColorInput}
                  />
                </TextField>
                <div className={cls("CreateLabelForm__color-picker", {dn: !focusColorInput})}>
                  <GithubPicker onChangeComplete={this.handleChangeComplete} />
                </div>
              </div>
            </div>
            <TextField
              outlined
              label="Description (optional)"
            >
              <Input
                name="description"
                value={description}
                onChange={this.handleChange}
              />
            </TextField>
          </div>
          <div className="flex-stable">
            <button
              className="mdc-button mdc-button--unelevated mt2"
              type="submit"
            >
              Create label
            </button>
            <button
              className="mdc-button mdc-button--outlined ml2 mt2"
              type="button"
              onClick={this.props.onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    )
  }
}

CreateLabelForm.propTypes = {
  onCancel: PropTypes.func,
}

CreateLabelForm.defaultProps = {
  onCancel: () => {},
}

export default withRouter(createFragmentContainer(CreateLabelForm, graphql`
  fragment CreateLabelForm_study on Study {
    id
  }
`))

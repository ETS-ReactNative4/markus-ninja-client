import * as React from 'react'
import PropTypes from 'prop-types'
import MaterialTextField, {Input} from '@material/react-text-field'
import Textarea from 'components/mdc/Textarea'
import {get} from 'utils'

export const defaultTextFieldState = {
  dirty: false,
  initialValue: "",
  name: "",
  valid: true,
  value: "",
  visited: false,
}

class TextField extends React.Component {
  constructor(props) {
    super(props)

    const value = get(props, "inputProps.value", "")

    this.state = {
      dirty: false,
      initialValue: value,
      name: get(props, "inputProps.name", ""),
      valid: true,
      value,
      visited: false,
    }
  }

  componentDidUpdate(prevProps) {
    const prevValue = get(prevProps, "inputProps.value", "")
    const newValue = get(this.props, "inputProps.value", "")
    if (prevValue !== newValue &&
      newValue !== this.state.value) {
      this.setState({value: newValue})
    }
  }

  handleChange = (e) => {
    const {initialValue} = this.state
    const valid = e.target.validity.valid
    const value = e.target.value

    const newState = {
      dirty: value !== initialValue,
      valid,
      value,
    }
    this.setState(newState)

    const onChange = get(this.props, "inputProps.onChange", () => {})
    onChange({
      ...this.state,
      ...newState,
    })
  }

  handleFocus = (e) => {
    const {visited} = this.state
    if (!visited) {
      this.setState({visited: true})
      const onChange = get(this.props, "inputProps.onChange", () => {})
      onChange({
        ...this.state,
        valid: e.target.validity.valid,
        visited: true,
      })
    }

    const onFocus = get(this.props, "inputProps.onFocus", () => {})
    onFocus(e)
  }

  get otherProps() {
    const {
      className,
      initialValue,
      name,
      onChange,
      onFocus,
      type,
      ...otherProps
    } = this.props
    return otherProps
  }

  render() {
    const {
      inputProps,
      ...textFieldProps
    } = this.props
    const {value} = this.state

    const InputComponent = this.props.textarea ? Textarea : Input

    return (
      <MaterialTextField {...textFieldProps}>
        <InputComponent
          {...inputProps}
          value={value}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
        />
      </MaterialTextField>
    )
  }
}

TextField.propTypes = {
  ...MaterialTextField.propTypes,
  inputProps: PropTypes.shape(Input.propTypes),
}

TextField.defaultProps = {
  ...MaterialTextField.defaultProps,
  inputProps: Input.defaultProps,
}

export default TextField

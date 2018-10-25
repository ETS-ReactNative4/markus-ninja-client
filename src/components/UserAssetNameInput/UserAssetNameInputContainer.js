import * as React from 'react'
import PropTypes from 'prop-types'
import {
  createRefetchContainer,
  graphql,
} from 'react-relay'
import cls from 'classnames'
import {HelperText} from '@material/react-text-field'
import TextField, {defaultTextFieldState} from 'components/TextField'
import { withRouter } from 'react-router'
import { debounce, get, isEmpty, isNil } from 'utils'

export const defaultUserAssetNameState = {
  ...defaultTextFieldState,
  name: "name",
  available: false,
}

class UserAssetNameInputContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      error: null,
      loading: false,
      name: {
        ...defaultUserAssetNameState,
        initialValue: this.props.initialValue,
        value: this.props.initialValue,
      },
    }
  }

  componentDidUpdate(prevProps) {
    const initialValue = this.props.initialValue
    if (initialValue !== prevProps.initialValue) {
      const name = {
        ...this.state.name,
        initialValue,
        value: initialValue,
      }
      this.setState({name})
      this._fetch(name.value)
    }
  }

  handleChange = (name) => {
    if (name.value !== this.state.name.value) {
      this.setState({
        name: {
          ...name,
          available: false,
        },
        loading: name.valid,
      })
      this.props.onChange(name)
      name.valid && this._refetch(name.value)
    }
  }

  _fetch = (name) => {
    const {disabled, relay} = this.props
    if (!disabled && !isEmpty(name)) {
      this.setState({
        loading: true,
      })
      relay.refetch(
        {
          owner: this.props.match.params.owner,
          name: this.props.match.params.name,
          filename: name,
          skip: isEmpty(name),
        },
        null,
        (error) => {
          if (error) {
            console.error(error)
          }
          const available = isNil(get(this.props, "query.study.asset"))
          const newName = {
            ...this.state.name,
            available,
          }
          this.setState({
            loading: false,
            name: newName,
          })
          this.props.onChange(newName)
        },
        {force: true},
      )
    }
  }

  _refetch = debounce(this._fetch, 500)

  get classes() {
    const {className} = this.props
    return cls("UserAssetNameInputContainer", className)
  }

  get label() {
    const {label} = this.props
    return label ? label : 'Enter name'
  }

  get isValid() {
    const {name} = this.state
    return name.valid && name.available
  }

  render() {
    const {disabled} = this.props
    const {name} = this.state

    return (
      <div className={this.classes}>
        <TextField
          className={!this.isValid ? "mdc-text-field--invalid" : ""}
          label={this.label}
          helperText={this.renderHelperText()}
          inputProps={{
            name: "name",
            required: true,
            pattern: "^([\\w-]+.)*[\\w-]+$",
            maxLength: 39,
            disabled,
            value: name.value,
            onChange: this.handleChange,
          }}
        />
      </div>
    )
  }

  renderHelperText() {
    const {loading, name} = this.state

    return (
      <HelperText persistent validation>
        {!name.valid
        ? "Invalid name"
        : loading
          ? "Loading..."
          : !isEmpty(name.value)
            ? `Name ${name.available ? "available" : "taken"}`
            : ""}
      </HelperText>
    )
  }
}

UserAssetNameInputContainer.propTypes = {
  initialValue: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
}

UserAssetNameInputContainer.defaultProps = {
  initialValue: "",
  onChange: () => {},
}

const refetchContainer = createRefetchContainer(UserAssetNameInputContainer,
  {
    query: graphql`
      fragment UserAssetNameInputContainer_query on Query @argumentDefinitions(
        owner: {type: "String!"},
        name: {type: "String!"},
        filename: {type: "String!"},
        skip: {type: "Boolean!"},
      ) {
        study(owner: $owner, name: $name) @skip(if: $skip) {
          asset(name: $filename) {
            id
          }
        }
      }
    `
  },
  graphql`
    query UserAssetNameInputContainerRefetchQuery(
      $owner: String!,
      $name: String!,
      $filename: String!
      $skip: Boolean!
    ) {
    ...UserAssetNameInputContainer_query @arguments(
      owner: $owner,
      name: $name,
      filename: $filename,
      skip: $skip,
    )
    }
  `,
)


export default withRouter(refetchContainer)

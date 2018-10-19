import * as React from 'react'
import PropTypes from 'prop-types'
import {
  createRefetchContainer,
  graphql,
} from 'react-relay'
import cls from 'classnames'
import TextField, {Input, HelperText} from '@material/react-text-field'
import { withRouter } from 'react-router'
import { debounce, get, isEmpty, isNil } from 'utils'

class UserAssetNameInputContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      error: null,
      fetched: false,
      loading: false,
      name: get(props, "initialValue", ""),
      nameAvailable: true,
      validInput: true,
    }
  }

  componentDidUpdate(prevProps) {
    const name = this.props.initialValue
    if (this.props.initialValue !== prevProps.initialValue) {
      this.setState({name})
      this.props.onChange(name, false)
      this._refetch(name)
    }
  }

  handleChange = (e) => {
    const name = e.target.value
    const valid = e.target.validity.valid
    this.setState({
      name,
      validInput: valid,
    })
    this.props.onChange(name, false)
    valid && this._refetch(name)
  }

  _refetch = debounce((name) => {
    const {disabled, relay} = this.props
    if (!disabled && !isEmpty(name)) {
      this.setState({
        fetched: true,
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
          const nameAvailable = isNil(get(this.props, "query.study.asset"))
          this.setState({
            loading: false,
            nameAvailable,
          })
          this.props.onChange(name, nameAvailable)
        },
        {force: true},
      )
    }
  }, 500)

  get classes() {
    const {className} = this.props
    return cls("UserAssetNameInputContainer", className)
  }

  get label() {
    const {label} = this.props
    return label ? label : 'Enter name'
  }

  get isValid() {
    const {nameAvailable, validInput} = this.state
    return validInput && nameAvailable
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
        >
          <Input
            name="name"
            required
            pattern="^([\w-]+.)*[\w-]+$"
            maxLength={39}
            disabled={disabled}
            value={name}
            onChange={this.handleChange}
          />
        </TextField>
      </div>
    )
  }

  renderHelperText() {
    const {fetched, loading, nameAvailable, validInput} = this.state

    return (
      <HelperText persistent validation>
        {!validInput
        ? "Invalid name"
        : loading
          ? "Loading..."
          : fetched
            ? `Name ${nameAvailable ? "available" : "taken"}`
            : ""}
      </HelperText>
    )
  }
}

UserAssetNameInputContainer.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
}

UserAssetNameInputContainer.defaultProps = {
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

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
    }
  }

  componentDidUpdate(prevProps) {
    const name = this.props.initialValue
    if (this.props.initialValue !== prevProps.initialValue) {
      this.handleChange(name)
    }
  }

  handleChange = (name) => {
    this.setState({ name })
    this.props.onChange(name, false)
    this._refetch(name)
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
          this.setState({ loading: false })
          const submittable = isNil(get(this.props, "query.study.asset"))
          this.props.onChange(name, submittable)
        },
        {force: true},
      )
    }
  }, 500)

  get classes() {
    const {className} = this.props
    return cls("UserAssetNameInputContainer", className)
  }

  get placeholder() {
    const {placeholder} = this.props
    return placeholder ? placeholder : 'Enter name'
  }

  render() {
    const {disabled} = this.props
    const {name} = this.state

    return (
      <div className={this.classes}>
        <TextField
          fullWidth
          label={this.placeholder}
          helperText={this.renderHelperText()}
        >
          <Input
            name="name"
            placeholder={this.placeholder}
            disabled={disabled}
            value={name}
            onChange={(e) => this.handleChange(e.target.value)}
          />
        </TextField>
      </div>
    )
  }

  renderHelperText() {
    const { fetched, loading, name } = this.state
    const asset = get(this.props, "query.study.asset", undefined)
    const nameTaken = !isEmpty(name) && fetched

    return (
      <HelperText persistent>
        {loading
        ? "Loading..."
        : nameTaken
          ? `Name ${asset ? "taken" : "available"}`
          : " "}
      </HelperText>
    )
  }
}

UserAssetNameInputContainer.propTypes = {
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

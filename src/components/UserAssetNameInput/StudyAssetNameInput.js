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

class StudyAssetNameInput extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      error: null,
      fetched: false,
      loading: false,
      name: get(props, "value", ""),
    }
  }

  componentDidUpdate(prevProps) {
    const name = this.props.value
    if (this.props.value !== prevProps.value) {
      this.handleChange(name)
    }
    if (this.props.disabled !== prevProps.disabled) {
      this.handleChange(this.state.name)
    }
  }

  handleChange = (name) => {
    this.setState({ name })
    this.props.onChange(name, false)
    this._refetch(name)
  }

  _refetch = debounce((name) => {
    if (!this.props.disabled && !isEmpty(name)) {
      this.setState({
        fetched: true,
        loading: true,
      })
      this.props.relay.refetch(
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
          const submittable = isNil(get(this.props, "study.asset"))
          this.props.onChange(this.state.name, submittable)
        },
        {force: true},
      )
    }
  }, 500)

  get classes() {
    const {className} = this.props
    return cls("StudyAssetNameInput", className)
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
          className="w-100"
          outlined
          label={this.placeholder}
          helperText={this.renderHelperText()}
        >
          <Input
            name="name"
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
    const asset = get(this.props, "study.asset", undefined)
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

StudyAssetNameInput.propTypes = {
  onChange: PropTypes.func,
}

StudyAssetNameInput.defaultProps = {
  onChange: () => {},
}

export default withRouter(createRefetchContainer(StudyAssetNameInput,
  {
    study: graphql`
      fragment StudyAssetNameInput_study on Study {
        asset(name: $filename) {
          id
        }
      }
    `
  },
  graphql`
    query StudyAssetNameInputRefetchQuery(
      $owner: String!,
      $name: String!,
      $filename: String!
      $skip: Boolean!
    ) {
      study(owner: $owner, name: $name) @skip(if: $skip) {
        ...StudyAssetNameInput_study
      }
    }
  `,
))

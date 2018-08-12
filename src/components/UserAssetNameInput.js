import * as React from 'react'
import {
  createRefetchContainer,
  graphql,
} from 'react-relay'
import { FontIcon, TextField } from 'react-md'
import cls from 'classnames'
import { withUID } from 'components/UniqueId'
import { withRouter } from 'react-router'
import { debounce, get, isEmpty, isNil } from 'utils'

class UserAssetNameInput extends React.Component {
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

  render() {
    const { className, disabled, uid } = this.props
    const { fetched, loading, name } = this.state
    const asset = get(this.props, "study.asset", undefined)

    return (
      <div className={cls("md-inline-block", className)}>
        <TextField
          id={`user-asset-name-input${uid}`}
          placeholder={get(this.props, "placeholder", "Enter name")}
          autoComplete="off"
          disabled={disabled}
          name="name"
          value={name}
          fullWidth={false}
          onChange={(name) => this.handleChange(name)}
          error={asset}
        />
        {/*<input
          autoComplete="off"
          className="form-control"
          disabled={disabled}
          type="text"
          name="name"
          placeholder="Enter name"
          value={name}
          onChange={(e) => this.handleChange(e.target.value)}
        />*/}
        {loading ?
        <FontIcon>autorenew</FontIcon> : !isEmpty(name) && fetched ?
        <FontIcon>{asset ? "clear" : "done"}</FontIcon> : null}
      </div>
    )
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

}

export default withUID((getUID) => ({uid: getUID() }))(withRouter(createRefetchContainer(UserAssetNameInput,
  {
    study: graphql`
      fragment UserAssetNameInput_study on Study {
        asset(name: $filename) {
          id
        }
      }
    `
  },
  graphql`
    query UserAssetNameInputRefetchQuery(
      $owner: String!,
      $name: String!,
      $filename: String!
    ) {
      study(owner: $owner, name: $name) {
        ...UserAssetNameInput_study
      }
    }
  `,
)))

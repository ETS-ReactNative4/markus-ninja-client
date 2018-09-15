import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router-dom';
import UserAssetNameInput from 'components/UserAssetNameInput/index'
import CreateUserAssetMutation from 'mutations/CreateUserAssetMutation'
import { get, isNil, makeCancelable } from 'utils'
import { getAuthHeader } from 'auth'

class CreateUserAssetForm extends React.Component {
  state = {
    request: {
      cancel() {}
    },
    file: null,
    name: "",
    submittable: false,
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleChangeFile = (e) => {
    const file = e.target.files[0]

    this.setState({
      file: e.target.files[0],
      name: file.name,
    })
  }

  handleSubmit = (e) => {
    const {file} = this.state
    if (!isNil(file)) {
      const Authorization = getAuthHeader()
      if (isNil(Authorization)) { return }
      const formData = new FormData()

      formData.append("save", true)
      formData.append("study_id", get(this.props, "study.id", ""))
      formData.append("file", file)

      this.props.onChange(file)

      const request = makeCancelable(fetch(process.env.REACT_APP_API_URL + "/upload/assets", {
        method: "POST",
        headers: {
          Authorization,
        },
        body: formData
      }))
      this.setState({request})

      request.promise.then((response) => {
        return response.text()
      }).then((responseBody) => {
        try {
          return JSON.parse(responseBody)
        } catch (error) {
          console.error(error)
          return responseBody
        }
      }).then((data) => {
        CreateUserAssetMutation(
          data.asset.id,
          this.props.study.id,
          this.state.name,
          (userAsset, errors) => {
            if (!isNil(errors)) {
              this.setState({ error: errors[0].message })
            }
            this.setState({
              loading: false,
              file: null,
            })
          }
        )
        return
      }).catch((error) => {
        console.error(error)
        return
      })
    }
  }

  get classes() {
    const {className} = this.props
    return cls("CreateUserAssetForm flex items-start flex-wrap", className)
  }

  render() {
    const {name} = this.state

    return (
      <form className={this.classes} onSubmit={this.handleSubmit}>
        <label
          className="mdc-button mdc-button--outlined mt2"
          htmlFor={"file-input"}
          title="Attach file"
          aria-label="Attach file"
        >
          File
          <input
            id={"file-input"}
            className="dn"
            type="file"
            onChange={this.handleChangeFile}
          />
        </label>
        <UserAssetNameInput
          className="mh2"
          value={name}
          study={get(this.props, "study", null)}
        />
        <div className="flex-stable">
          <button
            className="mdc-button mdc-button--unelevated mt2"
            type="submit"
          >
            Create asset
          </button>
          <button
            className="mdc-button mdc-button--outlined ml2 mt2"
            type="button"
            onClick={this.props.onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    )
  }
}

CreateUserAssetForm.propTypes = {
  onCancel: PropTypes.func,
}

CreateUserAssetForm.defaultProps = {
  onCancel: () => {},
}

export default withRouter(createFragmentContainer(CreateUserAssetForm, graphql`
  fragment CreateUserAssetForm_study on Study {
    id
  }
`))
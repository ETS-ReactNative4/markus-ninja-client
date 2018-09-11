import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router-dom';
import TextField, {Input} from '@material/react-text-field'
import CreateUserAssetMutation from 'mutations/CreateUserAssetMutation'
import { get, isEmpty } from 'utils'

class CreateUserAssetForm extends React.Component {
  state = {
    asset: null,
    error: null,
    name: "",
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const study =  get(this.props, "study.id", "")
    const {asset, name} = this.state
    CreateUserAssetMutation(
      asset.id,
      study.id,
      name,
      (asset, errors) => {
        if (!isEmpty(errors)) {
          this.setState({ error: errors[0].message })
        }
        this.props.history.push(get(asset, "resourcePath", ""))
      }
    )
  }

  get classes() {
    const {className} = this.props
    return cls("CreateUserAssetForm", className)
  }

  render() {
    const {name} = this.state
    return (
      <form className={this.classes} onSubmit={this.handleSubmit}>
        <div className="mdc-layout-grid__inner">
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-8-desktop mdc-layout-grid__cell--span-8-tablet">
            <div className="inline-flex items-center">
              <TextField outlined label="UserAsset name">
                <Input
                  name="name"
                  value={name}
                  onChange={this.handleChange}
                />
              </TextField>
            </div>
          </div>
          <div className="mdc-layout-grid__cell">
            <button className="mdc-button mdc-button--unelevated" type="submit">Create asset</button>
          </div>
        </div>
      </form>
    )
  }
}

export default withRouter(createFragmentContainer(CreateUserAssetForm, graphql`
  fragment CreateUserAssetForm_user on Study {
    id
  }
`))

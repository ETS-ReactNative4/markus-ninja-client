import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import CreateUserAssetForm from 'components/CreateUserAssetForm'

class CreateUserAssetPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("CreateUserAssetPage mdc-layout-grid mw7", className)
  }

  render() {
    return (
      <div className={this.classes}>
        <div className="mdc-layout-grid__inner">
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <div className="mdc-typography--headline4">Create a new asset</div>
          </div>
          <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <CreateUserAssetForm user={this.props.user} />
          </div>
        </div>
      </div>
    )
  }
}

export default createFragmentContainer(CreateUserAssetPage, graphql`
  fragment CreateUserAssetPage_user on Study {
    ...CreateUserAssetForm_user
  }
`)

import * as React from 'react'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { get } from 'utils'
import ActivityMetaDetails from './ActivityMetaDetails'

class ActivityMeta extends React.Component {
  state = {
    detailsOpen: false,
  }

  render() {
    const activity = get(this.props, "activity", null)
    const {detailsOpen} = this.state
    return (
      <React.Fragment>
        {detailsOpen &&
        <ActivityMetaDetails onOpen={(open) => this.setState({ detailsOpen: open })} activity={activity} />}
      </React.Fragment>
    )
  }
}

export default createFragmentContainer(ActivityMeta, graphql`
  fragment ActivityMeta_activity on Activity {
    ...ActivityMetaDetails_activity
  }
`)

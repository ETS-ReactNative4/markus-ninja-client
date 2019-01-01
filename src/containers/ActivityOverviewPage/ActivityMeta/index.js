import * as React from 'react'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { get } from 'utils'
import ActivityMetaDetails from './ActivityMetaDetails'
import ActivityMetaLesson from './ActivityMetaLesson'

class ActivityMeta extends React.Component {
  state = {
    detailsOpen: false,
  }

  render() {
    const {detailsOpen} = this.state
    const activity = get(this.props, "activity", null)
    return (
      <React.Fragment>
        <ActivityMetaDetails
          onOpen={() => this.setState({ detailsOpen: true})}
          onClose={() => this.setState({ detailsOpen: false})}
          activity={activity}
        />
        {!detailsOpen &&
        <ActivityMetaLesson activity={activity} />}
      </React.Fragment>
    )
  }
}

export default createFragmentContainer(ActivityMeta, graphql`
  fragment ActivityMeta_activity on Activity {
    ...ActivityMetaDetails_activity
    ...ActivityMetaLesson_activity
  }
`)

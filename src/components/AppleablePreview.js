import React, { Component } from 'react'
import { get } from 'utils'
import StudyPreview from './StudyPreview'

class AppleablePreview extends Component {
  render() {
    const apple = get(this.props, "apple", {})
    switch(apple.__typename) {
      case "Study":
        return <StudyPreview study={apple} />
      default:
        return null
    }
  }
}

export default AppleablePreview

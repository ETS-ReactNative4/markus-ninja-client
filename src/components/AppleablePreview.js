import * as React from 'react'
import { get } from 'utils'
import CoursePreview from 'components/CoursePreview'
import StudyPreview from 'components/StudyPreview'

class AppleablePreview extends React.Component {
  get otherProps() {
    const {
      className,
      appleable,
      ...otherProps,
    } = this.props
    return otherProps
  }

  render() {
    const {className} = this.props
    const appleable = get(this.props, "appleable", {})

    switch(appleable.__typename) {
      case "Course":
        return (
          <CoursePreview
            {...this.otherProps}
            className={className}
            course={appleable}
          />
        )
      case "Study":
        return (
          <StudyPreview.Apple
            {...this.otherProps}
            className={className}
            study={appleable}
          />
        )
      default:
        return null
    }
  }
}

export default AppleablePreview

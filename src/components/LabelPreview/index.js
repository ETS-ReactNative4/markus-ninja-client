import * as React from 'react'
import cls from 'classnames'
import Relay, {
  graphql,
} from 'react-relay'
import hoistNonReactStatic from 'hoist-non-react-statics'
import {get} from 'utils'
import Label from 'components/Label'
import StudyLabelPreview from './StudyLabelPreview'

const FRAGMENT = graphql`
  fragment LabelPreview_label on Label {
    ...Label_label
    color
    createdAt
    description
    id
    name
    resourcePath
    viewerCanDelete
    viewerCanUpdate
  }
`

class LabelPreview extends React.Component {
  static Study = Relay.createFragmentContainer(StudyLabelPreview, FRAGMENT)

  get classes() {
    const {className} = this.props
    return cls("LabelPreview", className)
  }

  render() {
    const label = get(this.props, "label", null)

    return <Label className={this.classes} label={label} />
  }
}

export default hoistNonReactStatic(
  Relay.createFragmentContainer(LabelPreview, FRAGMENT),
  LabelPreview,
)

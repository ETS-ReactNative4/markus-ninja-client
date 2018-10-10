import * as React from 'react'
import Relay, {
  graphql,
} from 'react-relay'
import hoistNonReactStatic from 'hoist-non-react-statics'
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

  render() {
    return <Label {...this.props} />
  }
}

export default hoistNonReactStatic(
  Relay.createFragmentContainer(LabelPreview, FRAGMENT),
  LabelPreview,
)

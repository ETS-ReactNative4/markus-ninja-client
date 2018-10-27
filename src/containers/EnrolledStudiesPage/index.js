import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import EnrolledStudiesPageNav from './EnrolledStudiesPageNav'
import ViewerEnrolledStudies from './ViewerEnrolledStudies'

import { STUDIES_PER_PAGE } from 'consts'

import "./styles.css"

const EnrolledStudiesPageQuery = graphql`
  query EnrolledStudiesPageQuery(
    $count: Int!,
    $after: String
  ) {
    viewer {
      id
      ...ViewerEnrolledStudies_viewer
    }
  }
`

class EnrolledStudiesPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("EnrolledStudiesPage mdc-layout-grid mw8", className)
  }

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={EnrolledStudiesPageQuery}
        variables={{
          count: STUDIES_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <div className={this.classes}>
                <div className="mdc-layout-grid__inner">
                  <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                    <EnrolledStudiesPageNav viewer={props.viewer} />
                  </div>
                  <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
                  <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                    <ViewerEnrolledStudies viewer={props.viewer} />
                  </div>
                </div>
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default EnrolledStudiesPage

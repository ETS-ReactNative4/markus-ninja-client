import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import StudyAssets from 'components/StudyAssets'
import { isNil } from 'utils'

import { LESSONS_PER_PAGE } from 'consts'

const StudyAssetsPageQuery = graphql`
  query StudyAssetsPageQuery(
    $owner: String!,
    $name: String!,
    $count: Int!,
    $after: String
  ) {
    study(owner: $owner, name: $name) {
      id
      resourcePath
      ...StudyAssets_study
    }
  }
`

class StudyAssetsPage extends Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={StudyAssetsPageQuery}
        variables={{
          owner: this.props.match.params.owner,
          name: this.props.match.params.name,
          count: LESSONS_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            if (isNil(props.study)) {
              return null
            }
            return (
              <div className="StudyAssetsPage">
                <StudyAssets study={props.study}></StudyAssets>
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default StudyAssetsPage

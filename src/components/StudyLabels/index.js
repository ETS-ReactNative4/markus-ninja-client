import * as React from 'react'
import PropTypes from 'prop-types'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import StudyLabelsContainer, {StudyLabelsProp, StudyLabelsPropDefaults} from './StudyLabelsContainer'

import { LABELS_PER_PAGE } from 'consts'

const StudyLabelsQuery = graphql`
  query StudyLabelsQuery(
    $owner: String!,
    $name: String!,
    $count: Int!,
    $after: String,
    $filterBy: LabelFilters,
    $orderBy: LabelOrder,
    $styleList: Boolean!,
    $styleToggle: Boolean!,
  ) {
    study(owner: $owner, name: $name) {
      ...StudyLabelsContainer_study @arguments(
        after: $after,
        count: $count,
        filterBy: $filterBy,
        orderBy: $orderBy,
        styleList: $styleList,
        styleToggle: $styleToggle,
      )
    }
  }
`

class StudyLabels extends React.Component {
  constructor(props) {
    super(props)

    const {filterBy, orderBy} = this.props

    this.state = {
      orderBy,
      filterBy,
    }
  }

  render() {
    const {orderBy, filterBy} = this.state
    const {count, fragment, match} = this.props

    return (
      <QueryRenderer
        environment={environment}
        query={StudyLabelsQuery}
        variables={{
          owner: match.params.owner,
          name: match.params.name,
          count,
          filterBy,
          orderBy,
          styleList: fragment === "list",
          styleToggle: fragment === "toggle",
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const {children, orderBy, filterBy} = this.props

            return (
              <StudyLabelsContainer
                count={count}
                filterBy={filterBy}
                orderBy={orderBy}
                study={props.study}
              >
                {children}
              </StudyLabelsContainer>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

StudyLabels.propTypes = {
  count: PropTypes.number,
  orderBy: PropTypes.shape({
    direction: PropTypes.string,
    field: PropTypes.string,
  }),
  filterBy: PropTypes.shape({
    isDefault: PropTypes.bool,
    search: PropTypes.string,
  }),
  fragment: PropTypes.oneOf(["list", "toggle"]).isRequired,
}

StudyLabels.defaultProps = {
  count: LABELS_PER_PAGE,
}

export {StudyLabelsProp, StudyLabelsPropDefaults}
export default withRouter(StudyLabels)

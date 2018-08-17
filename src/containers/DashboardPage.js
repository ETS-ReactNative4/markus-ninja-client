import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import cls from 'classnames'
import environment from 'Environment'
import { get, isNil } from 'utils'
import NotFound from 'components/NotFound'

const DashboardPageQuery = graphql`
  query DashboardPageQuery {
    viewer {
      id
    }
  }
`

class DashboardPage extends Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={DashboardPageQuery}
        variables={{
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            if (isNil(props.viewer)) {
              return <NotFound />
            }
            return (
              <div className="DashboardPage mdc-layout-grid">
                <div className="mdc-layout-grid__inner">
                  <div
                    className={cls(
                      "mdc-layout-grid__cell",
                      "mdc-layout-grid__cell--span-3-desktop",
                      "mdc-layout-grid__cell--span-2-tablet",
                      "mdc-layout-grid__cell--span-1-phone",
                    )}
                  >
                    studies
                  </div>
                  <div
                    className={cls(
                      "mdc-layout-grid__inner",
                      "mdc-layout-grid__cell--span-9-desktop",
                      "mdc-layout-grid__cell--span-10-tablet",
                      "mdc-layout-grid__cell--span-11-phone",
                    )}
                  >
                    activity
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

export default DashboardPage

import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'
import {Link} from 'react-router-dom'
import NotFound from 'components/NotFound'
import StudyLabels from 'components/StudyLabels'
import AddCommentForm from 'components/AddCommentForm'
import UserAsset from './UserAsset'
import UserAssetActivity from './UserAssetActivity'
import UserAssetHeader from './UserAssetHeader'
import UserAssetLabels from './UserAssetLabels'
import UserAssetTimeline from './UserAssetTimeline'
import AppContext from 'containers/App/Context'
import {get} from 'utils'

import { EVENTS_PER_PAGE } from 'consts'

import "./styles.css"

const UserAssetPageQuery = graphql`
  query UserAssetPageQuery($owner: String!, $name: String!, $filename: String!, $count: Int!, $after: String) {
    study(owner: $owner, name: $name) {
      asset(name: $filename) {
        id
        isActivityAsset
        ...UserAssetActivity_asset
        ...UserAssetHeader_asset
        ...UserAsset_asset
        ...UserAssetLabels_asset
        ...UserAssetTimeline_asset
        ...AddCommentForm_commentable
      }
    }
  }
`

class UserAssetPage extends React.Component {
  userAssetTimelineElement_ = React.createRef()

  handleLabelToggled_ = (checked) => {
    this.userAssetTimelineElement_ && this.userAssetTimelineElement_.current &&
      this.userAssetTimelineElement_.current.refetch()
  }

  get classes() {
    const {className} = this.props
    return cls("UserAssetPage rn-page rn-page--column", className)
  }

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={UserAssetPageQuery}
        variables={{
          owner: this.props.match.params.owner,
          name: this.props.match.params.name,
          filename: this.props.match.params.filename,
          count: EVENTS_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const asset = get(props, "study.asset", null)
            if (!asset) {
              return <NotFound />
            }
            return (
              <div className={this.classes}>
                <div className="mdc-layout-grid mw8">
                  <div className="mdc-layout-grid__inner">
                    <UserAssetHeader asset={asset} />
                    {asset.isActivityAsset &&
                    <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                      <UserAssetActivity asset={asset} />
                    </div>}
                    <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                      <UserAsset asset={props.study.asset} />
                    </div>
                    <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                      <div className="center mw8">
                        <StudyLabels fragment="toggle">
                          <UserAssetLabels asset={asset} onLabelToggled={this.handleLabelToggled_} />
                        </StudyLabels>
                        {asset.isActivityAsset && <UserAssetActivity asset={asset} />}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="UserAssetPage__timeline mdc-layout-grid">
                  <div className="UserAssetPage__timeline__container mdc-layout-grid__inner mw7">
                    {!this.context.isAuthenticated()
                    ? <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                        <div className="mdc-card mdc-card--outlined">
                          <div className="rn-card__header">
                            <Link className="rn-link mr1" to="/signin">Sign in</Link>
                            or
                            <Link className="rn-link mh1" to="/signup">Sign up</Link>
                            to leave a comment
                          </div>
                        </div>
                      </div>
                    : <AddCommentForm commentable={asset} />}
                    <UserAssetTimeline ref={this.userAssetTimelineElement_} asset={asset} />
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

UserAssetPage.contextType = AppContext

export default UserAssetPage

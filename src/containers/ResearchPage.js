import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import ResearchStudyPreview from 'components/ResearchStudyPreview'
import TopicPreview from 'components/TopicPreview'
import { get } from 'utils'

const ResearchPageQuery = graphql`
  query ResearchPageQuery {
    popularStudies: search(first: 6, query: "*", type: STUDY, orderBy:{direction:DESC, field:APPLE_COUNT}) {
      edges {
        node {
          id
          ...on Study {
            ...ResearchStudyPreview_study
          }
        }
      }
    }
    popularTopics: search(first: 6, query: "*", type: TOPIC, orderBy:{direction:DESC, field:TOPICED_COUNT}) {
      edges {
        node {
          id
          ...on Topic {
            ...TopicPreview_topic
          }
        }
      }
    }
  }
`

class ResearchPage extends Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={ResearchPageQuery}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const popularStudyEdges = get(props, "popularStudies.edges", [])
            const popularTopicEdges = get(props, "popularTopics.edges", [])
            return (
              <div>
                <h2>Popular studies</h2>
                <div className="mdc-layout-grid">
                  <div className="mdc-layout-grid__inner">
                    {popularStudyEdges.map(({node}) => (
                      <div key={node.id} className="mdc-layout-grid__cell">
                        <ResearchStudyPreview className="mdc-card pa3 h-100" study={node} />
                      </div>
                    ))}
                  </div>
                </div>
                <h2>Popular topics</h2>
                <div className="mdc-layout-grid">
                  <div className="mdc-layout-grid__inner">
                    {popularTopicEdges.map(({node}) => (
                      <div key={node.id} className="mdc-layout-grid__cell">
                        <div className="mdc-card">
                          <TopicPreview className="mdc-card__primary-action pa3 h-100" key={node.id} topic={node} />
                        </div>
                      </div>
                    ))}
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

export default withRouter(ResearchPage)

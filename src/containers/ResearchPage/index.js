import * as React from 'react'
import {
  QueryRenderer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { withRouter } from 'react-router'
import environment from 'Environment'
import CoursePreview from 'components/CoursePreview'
import StudyPreview from 'components/StudyPreview'
import TopicPreview from 'components/TopicPreview'
import { get } from 'utils'

import './styles.css'

const ResearchPageQuery = graphql`
  query ResearchPageQuery {
    popularCourses: search(first: 6, query: "*", type: COURSE, orderBy:{direction:DESC, field:APPLE_COUNT}) {
      edges {
        node {
          id
          ...on Course {
            ...CoursePreview_course
          }
        }
      }
    }
    popularStudies: search(first: 6, query: "*", type: STUDY, orderBy:{direction:DESC, field:APPLE_COUNT}) {
      edges {
        node {
          id
          ...on Study {
            ...StudyPreview_study
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

class ResearchPage extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={ResearchPageQuery}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const popularCourseEdges = get(props, "popularCourses.edges", [])
            const popularStudyEdges = get(props, "popularStudies.edges", [])
            const popularTopicEdges = get(props, "popularTopics.edges", [])

            return (
              <div className="rn-page">
                <header className="ResearchPage__header rn-header rn-header--hero">
                  <div className="rn-header--hero__content">
                    <h3>
                      Research
                    </h3>
                  </div>
                </header>
                <div className="mdc-layout-grid rn-page__grid">
                  <div className="mdc-layout-grid__inner">
                    <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                      <div className="mdc-layout-grid__inner">
                        <h5 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                          Popular courses
                        </h5>
                        {popularCourseEdges.map(({node}) => (
                          <div key={node.id} className="mdc-layout-grid__cell">
                            <CoursePreview.Card className="h-100" course={node} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                      <div className="mdc-layout-grid__inner">
                        <h5 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                          Popular studies
                        </h5>
                        {popularStudyEdges.map(({node}) => (
                          <div key={node.id} className="mdc-layout-grid__cell">
                            <StudyPreview.Card className="h-100" study={node} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                      <div className="mdc-layout-grid__inner">
                        <h5 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                          Popular topics
                        </h5>
                        {popularTopicEdges.map(({node}) => (
                          <div key={node.id} className="mdc-layout-grid__cell">
                            <TopicPreview.Card className="h-100" key={node.id} topic={node} />
                          </div>
                        ))}
                      </div>
                    </div>
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

import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import CoursePreview from 'components/CoursePreview'
import StudyPreview from 'components/StudyPreview'
import TopicPreview from 'components/TopicPreview'
import { get } from 'utils'

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
  get classes() {
    const {className} = this.props
    return cls("ResearchPage mdc-layout-grid", className)
  }

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
              <div className={this.classes}>
                <div className="mdc-layout-grid__inner">
                  <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                    <div className="mdc-layout-grid__inner">
                      <h5 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                        Popular courses
                      </h5>
                      {popularCourseEdges.map(({node}) => (
                        <div key={node.id} className="mdc-layout-grid__cell">
                          <CoursePreview.Apple className="mdc-card mdc-card--outlined pa3 h-100" course={node} />
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
                          <StudyPreview.Apple className="mdc-card mdc-card--outlined pa3 h-100" study={node} />
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
                          <div className="mdc-card mdc-card--outlined ">
                            <TopicPreview
                              className="mdc-card__primary-action pa3 h-100"
                              key={node.id}
                              topic={node}
                            />
                          </div>
                        </div>
                      ))}
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

import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  QueryRenderer,
  graphql,
} from 'react-relay'
import {Link} from 'react-router-dom'
import environment from 'Environment'
import CreateCourseLink from 'components/CreateCourseLink'
import CoursePreview from 'components/CoursePreview.js'
import SearchStudyCoursesInput from 'components/SearchStudyCoursesInput'
import { get, isEmpty, isNil } from 'utils'

import { COURSES_PER_PAGE } from 'consts'

const StudyCoursesPageQuery = graphql`
  query StudyCoursesPageQuery(
    $owner: String!,
    $name: String!,
    $count: Int!,
    $after: String
    $query: String!,
    $within: ID!
  ) {
    ...SearchStudyCoursesInput_query @arguments(
      owner: $owner,
      name: $name,
      count: $count,
      after: $after,
      query: $query,
      within: $within,
    )
    study(owner: $owner, name: $name) {
      id
      ...CreateCourseLink_study
      ...SearchStudyCoursesInput_study
    }
  }
`

class StudyCoursesPage extends React.Component {
  state = {
    hasMore: false,
    courseEdges: [],
    loadMore: () => {},
  }

  get classes() {
    const {className} = this.props
    return cls("StudyCoursesPage mdc-layout-grid", className)
  }

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={StudyCoursesPageQuery}
        variables={{
          owner: this.props.match.params.owner,
          name: this.props.match.params.name,
          count: COURSES_PER_PAGE,
          query: "*",
          within: get(this.props, "study.id"),
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            if (isNil(props.study)) {
              return null
            }
            const {hasMore, courseEdges, loadMore} = this.state
            return (
              <div className={this.classes}>
                <div className="mdc-layout-grid__inner">
                  <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                    <div className="inline-flex items-center w-100">
                      <SearchStudyCoursesInput
                        className="flex-auto mr4"
                        query={props}
                        study={props.study}
                        onQueryComplete={(courseEdges, hasMore, loadMore) =>
                          this.setState({ hasMore, courseEdges, loadMore })
                        }
                      />
                      <Link
                        className="mdc-button mdc-button--unelevated"
                        to={props.study.resourcePath + "/courses/new"}
                      >
                        New course
                      </Link>
                    </div>
                  </div>
                  <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
                  <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                    {isEmpty(courseEdges)
                    ? <React.Fragment>
                        <span className="mr1">
                          No courses were found.
                        </span>
                        <CreateCourseLink className="rn-link" study={props.study}>
                          Create a course.
                        </CreateCourseLink>
                      </React.Fragment>
                    : <div className="StudyCoursesPage__courses">
                        {courseEdges.map(({node}) => (
                          node && <CoursePreview key={node.id} course={node} />
                        ))}
                        {hasMore &&
                        <button
                          className="mdc-button mdc-button--unelevated"
                          onClick={loadMore}
                        >
                          More
                        </button>}
                      </div>
                    }
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

export default createFragmentContainer(StudyCoursesPage, graphql`
  fragment StudyCoursesPage_study on Study {
    id
  }
`)

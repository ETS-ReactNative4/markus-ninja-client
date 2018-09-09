import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  QueryRenderer,
  graphql,
} from 'react-relay'
import {Link} from 'react-router-dom'
import environment from 'Environment'
import CreateLessonLink from 'components/CreateLessonLink'
import StudyLabelsLink from 'components/StudyLabelsLink'
import SearchStudyLessonsInput from 'components/SearchStudyLessonsInput'
import LessonPreview from 'components/LessonPreview.js'
import { get, isEmpty, isNil } from 'utils'

import { LESSONS_PER_PAGE } from 'consts'

const StudyLessonsPageQuery = graphql`
  query StudyLessonsPageQuery(
    $owner: String!,
    $name: String!,
    $count: Int!,
    $after: String,
    $query: String!,
    $within: ID!
  ) {
    study(owner: $owner, name: $name) {
      ...CreateLessonLink_study
      ...StudyLabelsLink_study
      ...SearchStudyLessonsInput_study
      resourcePath
    }
  }
`

class StudyLessonsPage extends React.Component {
  state = {
    hasMore: false,
    lessonEdges: [],
    loadMore: () => {},
  }

  get classes() {
    const {className} = this.props
    return cls("StudyLessonsPage mdc-layout-grid__inner", className)
  }

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={StudyLessonsPageQuery}
        variables={{
          owner: this.props.match.params.owner,
          name: this.props.match.params.name,
          count: LESSONS_PER_PAGE,
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
            const {hasMore, lessonEdges, loadMore} = this.state
            return (
              <div className={this.classes}>
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  <div className="inline-flex items-center w-100">
                    <div className="mdc-text-field mdc-text-field--outlined w-100 mdc-text-field--inline mdc-text-field--with-trailing-icon">
                      <input
                        id="lessons-query"
                        className="mdc-text-field__input"
                        autoComplete="off"
                        type="text"
                        name="q"
                        placeholder="Find a lesson..."
                        value={q}
                        onChange={this.handleChange}
                      />
                      <div className="mdc-notched-outline mdc-theme--background z-behind">
                        <svg>
                          <path className="mdc-notched-outline__path"></path>
                        </svg>
                      </div>
                      <div className="mdc-notched-outline__idle mdc-theme--background z-behind"></div>
                      <i className="material-icons mdc-text-field__icon">
                        search
                      </i>
                    </div>
                    <StudyLabelsLink
                      className="mdc-button mdc-button--unelevated mr2"
                      study={props.study}
                    >
                      Labels
                    </StudyLabelsLink>
                    <Link
                      className="mdc-button mdc-button--unelevated"
                      to={props.study.resourcePath + "/lessons/new"}
                    >
                      New lesson
                    </Link>
                  </div>
                </div>
                <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  {isEmpty(lessonEdges)
                  ? <React.Fragment>
                      <span className="mr1">
                        No lessons were found.
                      </span>
                      <CreateLessonLink className="rn-link" study={props.study}>
                        Create a lesson.
                      </CreateLessonLink>
                    </React.Fragment>
                  : <div className="StudyLessons__lessons">
                      {lessonEdges.map(({node}) => (
                        node && <LessonPreview key={node.id} lesson={node} />
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
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default createFragmentContainer(StudyLessonsPage, graphql`
  fragment StudyLessonsPage_study on Study {
    id
  }
`)

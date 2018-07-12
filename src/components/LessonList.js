import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import LessonPreview from './LessonPreview.js'

class LessonList extends Component {
  render() {
    return (
      <div>
        {
          this.props.study.lessons.edges === undefined || this.props.study.lessons.edges.length < 1 ? (
            <Link
              className="LessonListPage__new-lesson"
              to={this.props.location.pathname + "/new"}
            >
              Create a lesson
            </Link>
          ) : (
            this.props.study.lessons.edges.map(({node}) => (
              <LessonPreview key={node.__id} lesson={node} />
            ))
          )
        }
      </div>
    )
  }
}

export default withRouter(createFragmentContainer(LessonList, graphql`
  fragment LessonList_study on Study {
    lessons(first:10, orderBy:{direction: ASC field:NUMBER}) @connection(key: "LessonList_lessons", filters: []) {
      edges {
        node {
          ...LessonPreview_lesson
        }
      }
      totalCount
    }
  }
`))

import * as React from 'react'
import cls from 'classnames'
import moment from 'moment'
import { Link } from 'react-router-dom'
import UserLink from 'components/UserLink'
import {get} from 'utils'

class SearchLessonPreview extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("SearchLessonPreview flex", className)
  }

  render() {
    const lesson = get(this.props, "lesson", {})

    return (
      <div className={this.classes}>
        <div className="inline-flex flex-column flex-auto">
          <Link className="rn-link self-start mdc-typography--headline6" to={lesson.resourcePath}>
            {lesson.title}
          </Link>
          <div className="mdc-typography--subtitle1 mdc-theme--text-secondary-on-light">
            #{lesson.number} created on
            <span className="mh1">{moment(lesson.createdAt).format("MMM D")}</span>
            by
            <UserLink className="rn-link rn-link--secondary ml1" user={get(lesson, "author", null)} />
          </div>
        </div>
        <Link
          className="rn-link inline-flex items-center self-start"
          to={lesson.resourcePath}
        >
          <i className="material-icons mr1">chat_bubble_outline</i>
          <span className="mdc-typography--subtitle2">
            {get(lesson, "commentCount", 0)}
          </span>
        </Link>
      </div>
    )
  }
}

export default SearchLessonPreview

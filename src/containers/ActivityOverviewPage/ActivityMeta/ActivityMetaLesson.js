import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {Link} from 'react-router-dom';

class ActivityMetaLesson extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const {activity} = this.props

    return (
      <div className={this.classes}>
        <h6>
          Activity for lesson
          <Link
            className="rn-link ml1"
            to={activity.lesson.resourcePath}
          >
            {activity.lesson.study.nameWithOwner}/{activity.lesson.title}
          </Link>
        </h6>
      </div>
    )
  }
}

ActivityMetaLesson.propTypes = {
  lesson: PropTypes.shape({
    resourcePath: PropTypes.string.isRequired,
    study: PropTypes.shape({
      nameWithOwner: PropTypes.string.isRequired,
    }),
    title: PropTypes.string.isRequired,
  }),
}

export default createFragmentContainer(ActivityMetaLesson, graphql`
  fragment ActivityMetaLesson_activity on Activity {
    lesson {
      resourcePath
      study {
        nameWithOwner
      }
      title
    }
  }
`)

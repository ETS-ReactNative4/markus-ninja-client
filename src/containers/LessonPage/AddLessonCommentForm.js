import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import AddLessonCommentMutation from 'mutations/AddLessonCommentMutation'
import StudyBodyEditor from 'components/StudyBodyEditor'
import { get, isNil } from 'utils'

class AddLessonCommentForm extends React.Component {
  state = {
    error: null,
    body: "",
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { body } = this.state
    AddLessonCommentMutation(
      this.props.lesson.id,
      body,
      (response, errors) => {
        if (!isNil(errors)) {
          this.setState({ error: errors[0].message })
        }
      }
    )
  }

  get classes() {
    const {className} = this.props
    return cls("AddLessonCommentForm mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const study = get(this.props, "lesson.study", null)

    return (
      <StudyBodyEditor study={study}>
        <StudyBodyEditor.Context.Consumer>
          {({clearText}) =>
            <form
              id="add-lesson-comment-form"
              className={this.classes}
              onSubmit={(e) => {this.handleSubmit(e); clearText()}}
            >
              <StudyBodyEditor.Main
                onChange={(body) => this.setState({body})}
                submitText="Comment"
                showFormButtonsFor="add-lesson-comment-form"
                placeholder="Leave a comment"
                study={study}
              />
            </form>}
        </StudyBodyEditor.Context.Consumer>
      </StudyBodyEditor>
    )
  }
}

AddLessonCommentForm.propTypes = {
  lesson: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
}

AddLessonCommentForm.defaultProps = {
  lesson: {
    id: "",
  },
}

export default withRouter(createFragmentContainer(AddLessonCommentForm, graphql`
  fragment AddLessonCommentForm_lesson on Lesson {
    id
    study {
      ...StudyBodyEditor_study
    }
  }
`))

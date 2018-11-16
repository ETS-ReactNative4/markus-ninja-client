import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import AddLessonCommentMutation from 'mutations/AddLessonCommentMutation'
import UpdateLessonCommentMutation from 'mutations/UpdateLessonCommentMutation'
import StudyBodyEditor from 'components/StudyBodyEditor'
import {debounce, get, isNil, throttle} from 'utils'

class AddLessonCommentForm extends React.Component {
  constructor(props) {
    super(props)

    const comment = get(this.props, "lesson.viewerNewComment", {})

    this.state = {
      error: null,
      draft: {
        dirty: false,
        initialValue: comment.draft,
        value: comment.draft,
      }
    }
  }

  autoSaveOnChange = throttle(
    debounce(() => this.updateDraft(this.state.draft.value), 30000)
  , 30000)

  updateDraft = throttle((draft) => {
    const comment = get(this.props, "lesson.viewerNewComment", {})

    if (this.state.draft.dirty) {
      UpdateLessonCommentMutation(
        comment.id,
        draft,
        (comment, errors) => {
          if (!isNil(errors)) {
            this.setState({ error: errors[0].message })
          }
          if (comment) {
            this.setState({
              draft: {
                ...this.state.draft,
                dirty: false,
                value: comment.draft
              }
            })
          }
        },
      )
    }
  }, 2000)

  handleCancel = () => {
    const {draft} = this.state
    this.updateDraft(draft.initialValue)
  }

  handleChange = (value) => {
    const {draft} = this.state
    const dirty = draft.dirty || value !== draft.value
    this.setState({
      draft: {
        dirty,
        value,
      },
    })
    if (dirty) {
      this.autoSaveOnChange()
    }
  }

  handlePreview = () => {
    const {draft} = this.state
    this.updateDraft(draft.value)
  }

  handlePublish = () => {
    AddLessonCommentMutation(
      get(this.props, "lesson.viewerNewComment.id", ""),
      (comment, errors) => {
        if (errors) {
          this.setState({ error: errors[0].message })
          return
        }
        this.setState({
          draft: {
            dirty: false,
            initialValue: comment.draft,
            value: comment.draft,
          }
        })
      }
    )
  }

  handleReset = () => {
    const comment = get(this.props, "lesson.viewerNewComment", {})
    const {draft} = this.state

    if (draft.value !== "") {
      UpdateLessonCommentMutation(
        comment.id,
        "",
        (comment, errors) => {
          if (!isNil(errors)) {
            this.setState({ error: errors[0].message })
          }
          if (comment) {
            this.setState({
              draft: {
                ...this.state.draft,
                dirty: false,
                value: comment.draft
              }
            })
          }
        },
      )
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const {draft} = this.state
    this.updateDraft(draft.value)
  }

  get classes() {
    const {className} = this.props
    return cls("AddLessonCommentForm mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const study = get(this.props, "lesson.study", null)
    const comment = get(this.props, "lesson.viewerNewComment", {})

    return (
      <StudyBodyEditor study={study}>
        <form
          id="add-lesson-comment-form"
          className={this.classes}
          onSubmit={this.handleSubmit}
        >
          <StudyBodyEditor.Main
            placeholder="Leave a comment"
            object={comment}
            showFormButtonsFor="add-lesson-comment-form"
            onCancel={this.handleCancel}
            onChange={this.handleChange}
            onPreview={this.handlePreview}
            onPublish={this.handlePublish}
            onReset={this.handleReset}
            study={study}
          />
        </form>
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
    viewerNewComment {
      bodyHTML
      draft
      id
      lastEditedAt
    }
  }
`))

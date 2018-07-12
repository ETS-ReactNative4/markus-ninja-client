import React, {Component} from 'react'
import CreateLessonForm from 'components/CreateLessonForm'

class CreateLessonFormPage extends Component {
  render() {
    return <CreateLessonForm study={this.props.study} />
  }
}

export default CreateLessonFormPage

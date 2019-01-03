import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'
import CreateLessonActivityForm from './CreateLessonActivityForm'

import "./styles.css"

const CreateLessonActivityPageQuery = graphql`
  query CreateLessonActivityPageQuery($owner: String!, $name: String!, $number: Int!) {
    study(owner: $owner, name: $name) {
      lesson(number: $number) {
        ...CreateLessonActivityForm_lesson
      }
    }
  }
`

class CreateLessonActivityPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("CreateLessonActivityPage mdc-layout-grid", className)
  }

  render() {
    const {match} = this.props

    return (
      <QueryRenderer
        environment={environment}
        query={CreateLessonActivityPageQuery}
        variables={{
          owner: match.params.owner,
          name: match.params.name,
          number: parseInt(this.props.match.params.number, 10),
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <div className={this.classes}>
                <div className="mdc-layout-grid__inner mw8">
                  <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                    <div className="mdc-typography--headline4">Create a new activity for this lesson</div>
                    <div className="mdc-typography--subtitle1 mdc-theme--text-secondary-on-light pb3">
                      Organize a study's assets into lists of examples for this lesson
                    </div>
                  </div>
                  <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
                  <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                    <CreateLessonActivityForm lesson={props.study.lesson} />
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

export default CreateLessonActivityPage

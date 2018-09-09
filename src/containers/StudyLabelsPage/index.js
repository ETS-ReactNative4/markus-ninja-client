import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import CreateLabelForm from 'components/CreateLabelForm'
import SearchStudy from 'components/SearchStudy'
import StudyLabels from './StudyLabels'
import { get } from 'utils'

class StudyLabelsPage extends React.Component {
  state = {
    q: "",
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  get classes() {
    const {className} = this.props
    return cls("StudyLabelsPage mdc-layout-grid__inner", className)
  }

  render() {
    const {q} = this.state
    const study = get(this.props, "study", null)

    return (
      <div className={this.classes}>
        <form
          className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
          action={get(this.props, "location.pathname")}
          acceptCharset="utf8"
          method="get"
        >
          <input
            id="labels-query"
            autoComplete="off"
            className="form-control"
            type="text"
            name="q"
            placeholder="Search..."
            value={q}
            onChange={this.handleChange}
          />
        </form>

        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <CreateLabelForm study={study} />
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <SearchStudy
            type="LABEL"
            study={study}
          >
            <StudyLabels />
          </SearchStudy>
        </div>
      </div>
    )
  }
}

export default createFragmentContainer(StudyLabelsPage, graphql`
  fragment StudyLabelsPage_study on Study {
    ...CreateLabelForm_study
    ...SearchStudy_study
  }
`)

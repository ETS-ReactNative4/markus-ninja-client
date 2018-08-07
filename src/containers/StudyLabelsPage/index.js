import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import queryString from 'query-string'
import CreateLabelForm from 'components/CreateLabelForm'
import AllStudyLabelsPage from './AllStudyLabelsPage'
import SearchStudyLabelsPage from './SearchStudyLabelsPage'
import { get } from 'utils'

class StudyLabelsPage extends React.Component {
  constructor(props) {
    super(props)

    const searchQuery = queryString.parse(get(props, "location.search", ""))
    this.state = {
      q: get(searchQuery, "q", ""),
    }
  }

  render() {
    const { q } = this.state
    const searchQuery = queryString.parse(get(this.props, "location.search", ""))
    const query = get(searchQuery, "q", undefined)
    const study = get(this.props, "study", null)

    return (
      <div className="StudyLabelsPage">
        <form action={get(this.props, "location.pathname")} acceptCharset="utf8" method="get">
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
        <CreateLabelForm study={study} />
        {query
        ? <SearchStudyLabelsPage study={study} />
        : <AllStudyLabelsPage />}
      </div>
    )
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

}

export default createFragmentContainer(StudyLabelsPage, graphql`
  fragment StudyLabelsPage_study on Study {
    ...SearchStudyLabelsPage_study
    ...CreateLabelForm_study
  }
`)

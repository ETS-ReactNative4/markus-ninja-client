import * as React from 'react'
import {withRouter} from 'react-router-dom'
import {SearchProp, SearchPropDefaults} from 'components/Search'
import SearchResults from 'components/SearchResults'
import StudySearchNav from './StudySearchNav'

class StudySearchPageResults extends React.Component {
  render() {
    const {search} = this.props

    return (
      <React.Fragment>
        <StudySearchNav counts={search.counts} />
        <SearchResults search={search} />
      </React.Fragment>
    )
  }
}

StudySearchPageResults.propTypes = {
  search: SearchProp,
}

StudySearchPageResults.defaultProps = {
  search: SearchPropDefaults,
}

export default withRouter(StudySearchPageResults)

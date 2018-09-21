import * as React from 'react'
import {withRouter} from 'react-router-dom'
import {SearchResultsProp, SearchResultsPropDefaults} from 'components/Search'
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
  search: SearchResultsProp,
}

StudySearchPageResults.defaultProps = {
  search: SearchResultsPropDefaults,
}

export default withRouter(StudySearchPageResults)

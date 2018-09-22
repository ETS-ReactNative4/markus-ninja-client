import * as React from 'react'
import {get} from 'utils'
import {SearchProp, SearchPropDefaults} from 'components/Search'
import CourseSearchResults from 'components/CourseSearchResults'
import LabelSearchResults from 'components/LabelSearchResults'
import LessonSearchResults from 'components/LessonSearchResults'
import StudySearchResults from 'components/StudySearchResults'
import TopicSearchResults from 'components/TopicSearchResults'
import UserSearchResults from 'components/UserSearchResults'
import AssetSearchResults from 'components/AssetSearchResults'

class SearchResults extends React.PureComponent {
  render() {
    const {type} = get(this.props, "search", {})
    switch(type) {
      case "COURSE":
        return <CourseSearchResults {...this.props} />
      case "LABEL":
        return <LabelSearchResults {...this.props} />
      case "LESSON":
        return <LessonSearchResults {...this.props} />
      case "STUDY":
        return <StudySearchResults {...this.props} />
      case "TOPIC":
        return <TopicSearchResults {...this.props} />
      case "USER":
        return <UserSearchResults {...this.props} />
      case "USER_ASSET":
        return <AssetSearchResults {...this.props} />
      default:
        return null
    }
  }
}

SearchResults.propTypes = {
  search: SearchProp,
}

SearchResults.defaultProps = {
  search: SearchPropDefaults,
}

export default SearchResults

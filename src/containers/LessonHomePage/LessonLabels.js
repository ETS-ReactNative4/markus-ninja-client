import * as React from 'react'
import PropTypes from 'prop-types'
import {
  createPaginationContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {withRouter} from 'react-router-dom';
import {StudyLabelsProp, StudyLabelsPropDefaults} from 'components/StudyLabels'
import LabelPreview from 'components/LabelPreview'
import LabelSet from 'components/LabelSet'
import {get, isEmpty} from 'utils'
import { LABELS_PER_PAGE } from 'consts'

class LessonLabels extends React.Component {
  _loadMore = () => {
    const {loadMore} = this.props.labels
    loadMore(LABELS_PER_PAGE)

    const relay = get(this.props, "relay")
    if (!relay.hasMore()) {
      console.log("Nothing more to load")
      return
    } else if (relay.isLoading()){
      console.log("Request is already pending")
      return
    }

    relay.loadMore(LABELS_PER_PAGE)
  }

  handleLabelChecked_ = (checked) => {
    this.props.onLabelToggled(checked)
  }

  get _hasMore() {
    const {hasMore} = this.props.labels
    return hasMore || this.props.relay.hasMore()
  }

  render() {
    let {edges: studyLabelEdges} = this.props.labels

    const lessonId = get(this.props, "lesson.id", "")
    const viewerCanUpdate = get(this.props, "lesson.viewerCanUpdate", false)
    const lessonLabelEdges = get(this.props, "lesson.labels.edges", [])
    const selectedLabelIds = lessonLabelEdges.map(({node}) => node.id)

    if (isEmpty(studyLabelEdges)) {
      return null
    } else if (!viewerCanUpdate) {
      studyLabelEdges = studyLabelEdges.reduce((r, v) => {
        if (selectedLabelIds.indexOf(get(v, "node.id")) > -1) {
          r.push(v)
        }
        return r
      }, [])
    }

    return (
      <div className="mv3">
        <LabelSet selectedLabelIds={selectedLabelIds}>
          {studyLabelEdges.map(({node}) =>
            node &&
            <LabelPreview.Toggle
              key={node.id}
              id={node.id}
              label={node}
              labelableId={lessonId}
              disabled={!viewerCanUpdate}
              onLabelChecked={this.handleLabelChecked_}
            />)}
        </LabelSet>
        {this._hasMore &&
        <button
          className="mdc-button mdc-button--unelevated"
          type="button"
          onClick={this._loadMore}
        >
          More
        </button>}
      </div>
    )
  }
}

LessonLabels.propTypes = {
  labels: StudyLabelsProp,
  onLabelToggled: PropTypes.func,
}

LessonLabels.defaultProps = {
  labels: StudyLabelsPropDefaults,
  onLabelToggled: () => {},
}


export default withRouter(createPaginationContainer(LessonLabels,
  {
    lesson: graphql`
      fragment LessonLabels_lesson on Lesson {
        id
        labels(
          first: $count,
          after: $after,
        ) @connection(key: "LessonLabels_labels", filters: []) {
          edges {
            node {
              id
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
        viewerCanUpdate
      }
    `,
  },
  {
    direction: 'forward',
    query: graphql`
      query LessonLabelsForwardQuery(
        $owner: String!,
        $name: String!,
        $number: Int!,
        $count: Int!,
        $after: String
      ) {
        study(owner: $owner, name: $name) {
          lesson(number: $number) {
            ...LessonLabels_lesson
          }
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "study.labels")
    },
    getFragmentVariables(previousVariables, totalCount) {
      return {
        ...previousVariables,
        count: totalCount,
      }
    },
    getVariables(props, paginationInfo, getFragmentVariables) {
      return {
        owner: props.match.params.owner,
        name: props.match.params.name,
        number: props.match.params.number,
        count: paginationInfo.count,
        after: paginationInfo.cursor,
      }
    }
  }
))

import * as React from 'react'
import cls from 'classnames'
import PropTypes from 'prop-types'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import {withRouter} from 'react-router-dom';
import Label from 'components/Label'
import LabelSet from 'components/LabelSet'
import {get, isEmpty} from 'utils'
import {LABELS_PER_PAGE} from 'consts'

class LessonMeta extends React.Component {
  state = {
    error: null,
  }

  _loadMore = () => {
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

  get classes() {
    const {className} = this.props
    return cls("LessonMeta mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const study = get(this.props, "study", {})
    const {open} = this.state

    return (
      <div className={this.classes}>
        {open && study.viewerCanAdmin
        ? this.renderLabelChecklist()
        : this.renderLabels()}
      </div>
    )
  }

  renderLabelChecklist() {
    const lessonId = get(this.props, "lesson.id", "")
    const viewerCanUpdate = get(this.props, "lesson.viewerCanUpdate", false)
    const lessonLabelEdges = get(this.props, "lesson.labels.edges", [])
    const studyLabelEdges = get(this.props, "lesson.study.labels.edges", [])
    const labelEdges =
      viewerCanUpdate
      ? studyLabelEdges
      : lessonLabelEdges

    if (isEmpty(labelEdges)) { return null }

    const selectedLabelIds = lessonLabelEdges.map(({node}) => node.id)

    return (
      <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
        <LabelSet selectedLabelIds={selectedLabelIds}>
          {labelEdges.map(({node}) =>
            node &&
            <Label
              key={node.id}
              id={node.id}
              label={node}
              labelableId={lessonId}
              disabled={!viewerCanUpdate}
            />)}
        </LabelSet>
      </div>
    )
  }

  renderLabels() {
    const lessonId = get(this.props, "lesson.id", "")
    const viewerCanUpdate = get(this.props, "lesson.viewerCanUpdate", false)
    const lessonLabelEdges = get(this.props, "lesson.labels.edges", [])
    const studyLabelEdges = get(this.props, "lesson.study.labels.edges", [])
    const labelEdges =
      viewerCanUpdate
      ? studyLabelEdges
      : lessonLabelEdges

    if (isEmpty(labelEdges)) { return null }

    const selectedLabelIds = lessonLabelEdges.map(({node}) => node.id)

    return (
      <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
        <LabelSet selectedLabelIds={selectedLabelIds}>
          {labelEdges.map(({node}) =>
            node &&
            <Label
              key={node.id}
              id={node.id}
              label={node}
              labelableId={lessonId}
              disabled={!viewerCanUpdate}
            />)}
        </LabelSet>
      </div>
    )
  }
}

LessonMeta.propTypes = {
  onOpen: PropTypes.func,
}

LessonMeta.defaulProps = {
  onOpen: () => {}
}

export default withRouter(createPaginationContainer(LessonMeta,
  {
    lesson: graphql`
      fragment LessonMeta_lesson on Lesson {
        id
        labels(
          first: $count,
          after: $after,
        ) @connection(key: "LessonMeta_labels", filters: []) {
          edges {
            node {
              id
              name
              resourcePath
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
        study {
          ...StudyLabelChecklist_study
        }
        viewerCanAdmin
      }
    `,
  },
  {
    direction: 'forward',
    query: graphql`
      query LessonMetaForwardQuery(
        $owner: String!,
        $name: String!,
        $number: Int!,
        $count: Int!,
        $after: String
      ) {
        study(owner: $owner, name: $name) {
          lesson(number: $number) {
            ...LessonMeta_lesson
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
        count: paginationInfo.count,
        after: paginationInfo.cursor,
      }
    }
  }
))

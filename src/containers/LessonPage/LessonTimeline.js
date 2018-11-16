import * as React from 'react'
import {
  createRefetchContainer,
  graphql,
} from 'react-relay'
import LessonTimelineEvent from './LessonTimelineEvent'
import {debounce, get, groupInOrderByFunc} from 'utils'

import {EVENTS_PER_PAGE} from 'consts'

class LessonTimeline extends React.Component {
  state = {
    error: null,
    loading: false,
  }

  _loadMore = () => {
    const {loading} = this.state
    const after = get(this.props, "lesson.timeline.pageInfo.endCursor")

    if (!this._hasMore) {
      console.log("Nothing more to load")
      return
    } else if (loading){
      console.log("Request is already pending")
      return
    }

    this.refetch(after)
  }

  refetch = debounce((after) => {
    const {relay} = this.props

    this.setState({
      loading: true,
    })

    relay.refetch(
      {
        after,
        count: EVENTS_PER_PAGE,
      },
      null,
      (error) => {
        if (error) {
          console.log(error)
        }
        this.setState({
          loading: false,
        })
      },
      {force: true},
    )
  }, 200)

  get _hasMore() {
    return get(this.props, "lesson.timeline.pageInfo.hasNextPage", false)
  }

  render() {
    return (
      <React.Fragment>
        {this.renderTimelineEdges()}
        {this._hasMore &&
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <div className="flex justify-center">
            <button
              className="mdc-button mdc-button--unelevated"
              onClick={this._loadMore}
            >
              Load More
            </button>
          </div>
        </div>}
      </React.Fragment>
    )
  }

  renderTimelineEdges() {
    const timelineEdges = groupInOrderByFunc(
      get(this.props, "lesson.timeline.edges", []),
      ({node}) => node && node.__typename !== "LessonComment",
    )

    return (
      <React.Fragment>
        {timelineEdges.map((group) => {
          if (group[0].node.__typename === "LessonComment") {
            return group.map(({node}) =>
              node &&
              <LessonTimelineEvent
                key={node.id}
                className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
                item={node}
              />
            )
          } else {
            return (
              <div key={group[0].node.id} className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                <div className="mdc-card mdc-card--outlined ph2">
                  <ul className="mdc-list">
                    {group.map(({node}) =>
                      node && <LessonTimelineEvent key={node.id} item={node} />)}
                  </ul>
                </div>
              </div>
            )
          }
        })}
      </React.Fragment>
    )
  }
}

export default createRefetchContainer(LessonTimeline,
  {
    lesson: graphql`
      fragment LessonTimeline_lesson on Lesson {
        timeline(
          first: $count,
          after: $after,
          orderBy: {direction: DESC, field: CREATED_AT}
        ) @connection(key: "LessonTimeline_timeline", filters: []) {
          edges {
            node {
              __typename
              id
              ...on AddedToCourseEvent {
                ...AddedToCourseEvent_event
              }
              ...on LabeledEvent {
                ...LabeledEvent_event
              }
              ...on LessonComment {
                ...LessonComment_comment
              }
              ...on PublishedEvent {
                ...PublishedEvent_event
              }
              ...on ReferencedEvent {
                ...ReferencedEvent_event
              }
              ...on RemovedFromCourseEvent {
                ...RemovedFromCourseEvent_event
              }
              ...on RenamedEvent {
                ...RenamedEvent_event
              }
              ...on UnlabeledEvent {
                ...UnlabeledEvent_event
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
  },
  graphql`
    query LessonTimelineForwardQuery(
      $owner: String!,
      $name: String!,
      $number: Int!,
      $count: Int!,
      $after: String,
    ) {
      study(owner: $owner, name: $name) {
        lesson(number: $number) {
          ...LessonTimeline_lesson
        }
      }
    }
  `,
)

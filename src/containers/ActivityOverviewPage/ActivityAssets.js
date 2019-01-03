import * as React from 'react'
import cls from 'classnames'
import {
  createPaginationContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {Link} from 'react-router-dom'
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'
import Icon from 'components/Icon'
import UserAssetPreview from 'components/UserAssetPreview'
import MoveActivityAssetMutation from 'mutations/MoveActivityAssetMutation'
import {get, isEmpty, moveListItem} from 'utils'
import AddActivityAssetDialog from './AddActivityAssetDialog'

import { LESSONS_PER_PAGE } from 'consts'

class ActivityAssets extends React.Component {
  state = {
    addFormDialogOpen: false,
    edges: get(this.props, "activity.assets.edges", []),
    edit: false,
  }

  componentDidUpdate(prevProps) {
    const prevEdges = get(prevProps, "activity.assets.edges", [])
    const newEdges = get(this.props, "activity.assets.edges", [])
    if (prevEdges.length !== newEdges.length) {
      this.setState({edges: newEdges})
    }
  }

  handleDragEnd = (result) => {
    if (!result.destination) {
      return
    } else if (result.source.index === result.destination.index) {
      return
    }

    const {edges} = this.state

    const activityId = get(this.props, "activity.id", "")
    const assetId = get(edges[result.source.index], "node.id", "")
    const afterAssetId = get(edges[result.destination.index], "node.id", "")
    const assetActivityNumber = get(edges[result.source.index], "node.activityNumber", 0)

    const newEdges = moveListItem(
      edges,
      result.source.index,
      result.destination.index
    )

    this.setState({edges: newEdges})

    MoveActivityAssetMutation(
      activityId,
      assetId,
      afterAssetId,
      assetActivityNumber,
      (response, errors) => {
        if (errors) {
          console.error(errors[0].message)
        }
        this.setState({edges: get(this.props, "activity.assets.edges", [])})
      },
    )
  }

  handleToggleAddFormDialog = () => {
    const {addFormDialogOpen} = this.state
    this.setState({
      addFormDialogOpen: !addFormDialogOpen,
    })
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

    relay.loadMore(LESSONS_PER_PAGE)
  }

  get classes() {
    const {className} = this.props
    return cls("ActivityAssets mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  get firstAssetResourcePath() {
    const {edges} = this.state
    for (let edge of edges) {
      if (get(edge, "node.activityNumber") === 1) {
        return get(edge, "node.resourcePath", "")
      }
    }
    return ""
  }

  render() {
    const {addFormDialogOpen, edit, edges} = this.state
    const viewerCanAdmin = get(this.props, "activity.viewerCanAdmin", false)
    const noResults = isEmpty(edges)

    return (
      <div className={this.classes}>
        <div className="mdc-card mdc-card--outlined ph2">
          <div className="rn-card__header mdc-typography--caption mdc-theme--text-secondary-on-light">
            Please note that assets may be part of only one activity.
          </div>
          <div className="rn-card__body">
            {edit
            ? this.renderEdittableAssets()
            : this.renderAssets()}
          </div>
          {(!noResults || viewerCanAdmin) &&
          <div className="mdc-card__actions">
            <div className="mdc-card__action-buttons">
              {!noResults
              ? <Link
                  className="mdc-button mdc-card__action mdc-card__action--button"
                  to={this.firstAssetResourcePath}
                >
                  Explore
                </Link>
              : viewerCanAdmin
                ? <button
                    className="mdc-button mdc-card__action mdc-card__action--button"
                    type="button"
                    onClick={this.handleToggleAddFormDialog}
                  >
                    Add asset
                  </button>
              : null}
              {this.props.relay.hasMore() &&
              <button
                className="mdc-button mdc-button--unelevated mdc-card__action mdc-card__action--button"
                type="button"
                onClick={this._loadMore}
              >
                More
              </button>}
            </div>
            <div className="mdc-card__action-icons">
              {viewerCanAdmin &&
              <button
                className="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
                type="button"
                onClick={this.handleToggleAddFormDialog}
                aria-label="Add asset"
                title="Add asset"
              >
                add
              </button>}
              {!noResults && viewerCanAdmin &&
              <button
                className={cls(
                  "mdc-icon-button mdc-card__action mdc-card__action--icon",
                  {"mdc-icon-button--on": edit},
                )}
                aria-pressed={edit}
                type="button"
                onClick={() => this.setState({edit: !edit})}
                aria-label="Edit assets"
                title="Edit assets"
              >
                <i className="material-icons mdc-icon-button__icon">edit</i>
                <i className="material-icons mdc-icon-button__icon mdc-icon-button__icon--on mdc-theme--text-primary-on-background">edit</i>
              </button>}
            </div>
          </div>}
        </div>
        <AddActivityAssetDialog
          activity={get(this.props, "activity", null)}
          open={addFormDialogOpen}
          onClose={this.handleToggleAddFormDialog}
        />
      </div>
    )
  }

  renderEdittableAssets() {
    const {edges} = this.state

    return (
      <DragDropContext onDragEnd={this.handleDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided, snapshot) => (
            <ul
              ref={provided.innerRef}
              className="rn-image-list mdc-image-list mdc-image-list--with-text-protection"
            >
              {edges.map(({node}, index) => (
                node &&
                <Draggable key={node.id} draggableId={node.id} index={index}>
                  {(provided, snapshot) => (
                    <UserAssetPreview.List
                      innerRef={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      isActivity
                      dragging={snapshot.isDragging}
                      editing
                      asset={node}
                    />
                  )}
                </Draggable>
              ))}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    )
  }

  renderAssets() {
    const {edges} = this.state
    const noResults = isEmpty(edges)

    if (noResults) {
      return this.renderEmptyListPlaceholder()
    }
    return (
      <ul className="rn-image-list mdc-image-list mdc-image-list--with-text-protection">
        {edges.map(({node}, index) => (
            node &&
            <UserAssetPreview.List
              key={node.id}
              isActivity
              asset={node}
            />
          ))}
      </ul>
    )
  }

  renderEmptyListPlaceholder() {
    const viewerCanAdmin = get(this.props, "activity.viewerCanAdmin", false)

    return (
      <ul className="mdc-list">
        <li
          className="mdc-list-item pointer"
          onClick={viewerCanAdmin ? this.handleToggleAddFormDialog : null}
        >
          <Icon as="span" className="mdc-list-item__graphic" icon="asset" />
          {viewerCanAdmin
          ? "Add the first asset"
          : "No assets"}
          {viewerCanAdmin &&
          <span className="mdc-list-item__meta">
            <i className="material-icons">add</i>
          </span>}
        </li>
      </ul>
    )
  }
}

export default createPaginationContainer(ActivityAssets,
  {
    activity: graphql`
      fragment ActivityAssets_activity on Activity @argumentDefinitions(
        after: {type: "String"},
        count: {type: "Int!"},
      ) {
        ...AddActivityAssetDialog_activity
        id
        assets(
          first: $count,
          after: $after,
          orderBy:{direction: ASC field: ACTIVITY_NUMBER}
        ) @connection(key: "ActivityAssets_assets", filters: []) {
          edges {
            cursor
            node {
              ...ListUserAssetPreview_asset
              activityNumber
              id
              resourcePath
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
        viewerCanAdmin
      }
    `,
  },
  {
    direction: 'forward',
    query: graphql`
      query ActivityAssetsForwardQuery(
        $owner: String!,
        $name: String!,
        $number: Int!,
        $count: Int!,
        $after: String
      ) {
        study(owner: $owner, name: $name) {
          activity(number: $number) {
            ...ActivityAssets_activity @arguments(
              after: $after,
              count: $count,
            )
          }
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "activity.assets")
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
        number: parseInt(this.props.match.params.number, 10),
        count: paginationInfo.count,
        after: paginationInfo.cursor,
      }
    },
  },
)

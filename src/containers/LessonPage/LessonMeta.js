import * as React from 'react'
import cls from 'classnames'
import PropTypes from 'prop-types'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import { Link, withRouter } from 'react-router-dom';
import TextField, {HelperText, Input} from '@material/react-text-field'
import Label from 'components/Label'
import AddLabelMutation from 'mutations/AddLabelMutation'
import RemoveLabelMutation from 'mutations/RemoveLabelMutation'
import {get, isEmpty, isNil} from 'utils'
import { TOPICS_PER_PAGE } from 'consts'

class LessonMeta extends React.Component {
  state = {
    error: null,
  }

  handleLabelChecklist = (labelId, checked) => {
    if (checked) {
      AddLabelMutation(
        labelId,
        this.props.lesson.id,
        (response, error) => {
          if (!isNil(error)) {
            this.setState({ error: error[0].message })
          }
        },
      )
    } else {
      RemoveLabelMutation(
        labelId,
        this.props.lesson.id,
        (response, error) => {
          if (!isNil(error)) {
            this.setState({ error: error[0].message })
          }
        },
      )
    }
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

    relay.loadMore(TOPICS_PER_PAGE)
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
        ? this.renderForm()
        : this.renderLabels()}
      </div>
    )
  }

  renderForm() {
    const study = get(this.props, "study", {})
    const labelEdges = get(study, "labels.edges", [])
    const {labels} = this.state

    return (
      <form className="StudyMeta__form inline-flex w-100" onSubmit={this.handleSubmit}>
        <div className="flex-auto">
          <TextField
            className="w-100"
            outlined
            label="Labels (separate with spaces)"
            helperText={this.renderHelperText()}
            floatingLabelClassName={!isEmpty(labelEdges) ? "mdc-floating-label--float-above" : ""}
          >
            <Input
              name="labels"
              value={labels}
              onChange={this.handleChange}
            />
          </TextField>
        </div>
        <div className="inline-flex items-center pa2 mb4">
          <button
            className="mdc-button mdc-button--unelevated"
            type="submit"
            onClick={this.handleSubmit}
          >
            Save
          </button>
          <span
            className="pointer pa2 underline-hover"
            role="button"
            onClick={this.handleToggleOpen}
          >
            Cancel
          </span>
        </div>
      </form>
    )
  }

  renderLabels() {
    const study = get(this.props, "study", {})
    const labelEdges = get(study, "labels.edges", [])
    const pageInfo = get(study, "labels.pageInfo", {})

    return (
      <div className="inline-flex items-center w-100">
        {labelEdges.map(({node}) =>
          <Label key={get(node, "id", "")} label={node} />)}
        {pageInfo.hasNextPage &&
        <button
          className="material-icons mdc-icon-button mr1 mb1"
          onClick={this._loadMore}
        >
          More
        </button>}
        {study.viewerCanAdmin &&
        <button
          className="mdc-button mdc-button--unelevated mr1 mb1"
          type="button"
          onClick={this.handleToggleOpen}
        >
          Manage labels
        </button>}
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
    study: graphql`
      fragment LessonMeta_study on Study {
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
        $count: Int!,
        $after: String
      ) {
        study(owner: $owner, name: $name) {
          ...LessonMeta_study
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

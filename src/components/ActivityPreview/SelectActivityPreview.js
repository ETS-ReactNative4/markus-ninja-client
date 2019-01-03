import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'

class SelectActivityPreview extends React.Component {
  handleClick = (e) => {
    const {activity} = this.props
    this.props.onClick(activity)
  }

  get classes() {
    const {className, selected} = this.props

    return cls("SelectActivityPreview mdc-list-item pointer", className, {
      "mdc-list-item--selected": selected,
    })
  }

  get otherProps() {
    const {
      children,
      className,
      innerRef,
      activity,
      selected,
      twoLine,
      ...otherProps
    } = this.props

    return otherProps
  }

  render() {
    const {innerRef, activity} = this.props

    if (!activity) {
      return null
    }

    return (
      <li
        {...this.otherProps}
        ref={innerRef}
        className={this.classes}
        onClick={this.handleClick}
      >
        {this.renderText()}
      </li>
    )
  }

  renderText() {
    const {activity, twoLine} = this.props
    if (twoLine) {
      return (
        <span className="mdc-list-item__text">
          <span className="mdc-list-item__primary-text">
            {activity.name}
          </span>
          <span className="mdc-list-item__secondary-text">
            {activity.study.nameWithOwner}#{activity.number}
          </span>
        </span>
      )
    }

    return (
      <span className="mdc-list-item__text">
        {activity.name}
      </span>
    )
  }
}

SelectActivityPreview.propTypes = {
  activity: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired,
    resourcePath: PropTypes.string.isRequired,
    study: PropTypes.shape({
      nameWithOwner: PropTypes.string.isRequired,
    }),
  }),
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  twoLine: PropTypes.bool,
}

SelectActivityPreview.defaultProps = {
  activity: {
    id: "",
    name: "",
    number: 0,
    resourcePath: "",
    study: {
      nameWithOwner: "",
    },
  },
  onClick: () => {},
  selected: false,
  twoLine: false,
}

export default createFragmentContainer(SelectActivityPreview, graphql`
  fragment SelectActivityPreview_activity on Activity {
    id
    name
    number
    resourcePath
    study {
      nameWithOwner
    }
  }
`)

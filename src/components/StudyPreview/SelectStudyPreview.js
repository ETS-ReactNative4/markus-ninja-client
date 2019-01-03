import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'

class SelectStudyPreview extends React.Component {
  handleClick = (e) => {
    const {study} = this.props
    this.props.onClick(study)
  }

  get classes() {
    const {className, selected} = this.props

    return cls("SelectStudyPreview mdc-list-item pointer", className, {
      "mdc-list-item--selected": selected,
    })
  }

  get otherProps() {
    const {
      children,
      className,
      innerRef,
      study,
      selected,
      ...otherProps
    } = this.props

    return otherProps
  }

  render() {
    const {innerRef, study} = this.props

    if (!study) {
      return null
    }

    return (
      <li
        {...this.otherProps}
        ref={innerRef}
        className={this.classes}
        onClick={this.handleClick}
      >
        <span className="mdc-list-item__text">
          {study.nameWithOwner}
        </span>
      </li>
    )
  }
}

SelectStudyPreview.propTypes = {
  study: PropTypes.shape({
    id: PropTypes.string.isRequired,
    nameWithOwner: PropTypes.string.isRequired,
    resourcePath: PropTypes.string.isRequired,
  }),
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool,
}

SelectStudyPreview.defaultProps = {
  study: {
    id: "",
    nameWithOwner: "",
    resourcePath: "",
  },
  onClick: () => {},
  selected: false,
}

export default createFragmentContainer(SelectStudyPreview, graphql`
  fragment SelectStudyPreview_study on Study {
    id
    nameWithOwner
    resourcePath
  }
`)

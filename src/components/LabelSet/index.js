import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'

class LabelSet extends React.Component {
  state = {
    selectedLabelIds: new Set(this.props.selectedLabelIds),
  }

  componentDidUpdate(prevProps) {
    if(this.props.selectedLabelIds !== prevProps.selectedLabelIds) {
      this.setState({selectedLabelIds: new Set(this.props.selectedLabelIds)})
    }
  }

  get classes() {
    const {className} = this.props
    return cls("LabelSet mdc-chip-set", className)
  }

  renderLabel = (label) => {
    const {selectedLabelIds} = this.state

    const props = Object.assign({
      selected: selectedLabelIds.has(label.props.id),
    })

    return React.cloneElement(label, props)
  }

  render() {
    return (
      <div className={this.classes}>
        {React.Children.map(this.props.children, this.renderLabel)}
      </div>
    )
  }
}

LabelSet.propTypes = {
  className: PropTypes.string,
  selectedLabelIds: PropTypes.array,
  children: PropTypes.node,
}

LabelSet.defaultProps = {
  className: "",
  selectedLabelIds: [],
  children: null,
}

export default LabelSet

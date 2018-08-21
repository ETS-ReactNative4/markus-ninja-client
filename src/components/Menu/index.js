import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {MDCMenuFoundation} from '@material/menu/dist/mdc.menu'

class Menu extends React.Component {
  foundation_ = null

  state = {
    classList: new Set(),
    element: new Map()
  }

  constructor(props) {
    super(props)

    this.menuElement = React.createRef()
  }

  componentDidMount() {
    this.foundation_ = new MDCMenuFoundation(this.adapter)
    this.foundation_.init()
  }

  componentWillUnmount() {
    this.foundation_.destroy()
  }

  addClassesToElement(classes, element) {
    const updatedProps = {
      className: cls(classes, element.props.className),
    }
    return React.cloneElement(element, updatedProps)
  }

  get elements() {

  }

  get classes() {
    const {classList} = this.state
    const {className, surface} = this.props
    return cls('mdc-menu', Array.from(classList), className, {
      'mdc-menu-surface': surface,
    })
  }

  get otherProps() {
    const {
      className,
      ...otherProps,
    } = this.props

    return otherProps
  }

  get adapter() {
    return {
      addClassToElementAtIndex: (index, className) => {
      },
      removeClassFromElementAtIndex: (index, className) => {
      },
      addAttributeToElementAtIndex: (index, attr, value) => {
      },
      removeAttributeFromElementAtIndex: (index, attr) => {
      },
      elementContainsClass: (element, className) => {
      },
      closeSurface: () => {
      },
      getElementIndex: (element) => {
      },
      getParentElement: (element) => {
      },
      getSelectedElementIndex: (element) => {
      },
      notifySelected: (index) => {
      },
      getCheckboxAtIndex: (index) => {
      },
      toggleCheckbox: (checkbox) => {
      },
    }
  }

  render() {
    const {
    } = this.props

    return (
      <div
        {...this.otherProps}
        className={this.classes}
        ref={this.menuElement}
      >
        {this.renderMenuItems()}
      </div>
    )
  }

  renderMenuItems() {
    const {items} = this.props
    if (!items) {
      return
    }

    return (
      <ul className="mdc-list" role="menu" aria-hidden="true" aria-orientation="vertical">
        {items.map((item, key) => {
          const elementWithClasses = this.addClassesToElement(
            'mdc-list-item', item
          )
          return React.cloneElement(elementWithClasses, {key})
        })}
      </ul>
    )
  }
}

Menu.propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.element),
  surface: PropTypes.bool,
}

Menu.defaultProps = {
  className: '',
  items: null,
  surface: false,
}

export default Menu

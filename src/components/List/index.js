import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import shortid from 'shortid'
import {MDCListFoundation} from '@material/list/dist/mdc.list'
import {debounce, throttle, recursiveReactChildrenMap} from 'utils'

class List extends React.Component {

  root_ = null
  foundation_ = null

  constructor(props) {
    super(props)

    this.state = {
      items: [],
    }
  }

  destroy() {
    this.root_.removeEventListener('keydown', this.handleKeydown_)
    this.root_.removeEventListener('click', this.handleClick_)
    this.foundation_.destroy()
  }

  init() {
    this.handleKeydown_ = this.foundation_.handleKeydown.bind(this.foundation_)
    this.handleClick_ = this.foundation_.handleClick.bind(this.foundation_)
    this.root_.addEventListener('keydown', this.handleKeydown_)
    this.root_.addEventListener('click', this.handleClick_)
    this.layout()
    this.singleSelection = this.props.singleSelection
    this.items = this.props.items
  }

  layout() {
    this.vertical = this.props.vertical
  }

  componentDidMount() {
    this.foundation_ = new MDCListFoundation(this.adapter)
    this.foundation_.init()
    this.init()
  }

  componentDidUpdate(prevProps, prevState) {
    // this.checkForNewItems(prevProps, this.props)
    if (prevProps.items !== this.props.items) {
      this.items = this.props.items
    }
  }

  componentWillUnmount() {
    this.destroy()
  }

  checkForNewItems = debounce(throttle((prevProps, newProps) => {
    const oldIds = [],
          newIds = []
    recursiveReactChildrenMap(newProps.children, (child) => {
      if (child.type.name === 'ListItem') {
        oldIds.push(child.props.id)
      }
      return null
    })
    recursiveReactChildrenMap(prevProps.children, (child) => {
      if (child.type.name === 'ListItem') {
        newIds.push(child.props.id)
      }
      return null
    })

    oldIds.some((id1) => newIds.some((id2) => {
      const newChildren = id1 !== id2
      if (newChildren) {
        this.items = newProps.children
      }
      return newChildren
    }))
  }, 1000), 500)

  getItemElement(item) {
    const props = {}
    item.propMap.forEach((v, k) => props[k] = v)
    return React.cloneElement(item.element, props)
  }

  set items(propItems) {
    const items = []
    propItems.map((item) => {
      if (item.type.name === 'ListItem') {
        items.push({
          element: item,
          propMap: new Map(),
          id: shortid.generate(),
        })
      }
      return null
    })

    this.listElements_ = items.map(() => React.createRef())

    this.setState({items})
  }

  set singleSelection(isSingleSelectionList) {
    if (isSingleSelectionList) {
      this.root_.addEventListener('click', this.handleClick_)
    } else {
      this.root_.removeEventListener('click', this.handleClick_)
    }

    this.foundation_.setSingleSelection(isSingleSelectionList)
  }

  set vertical(value) {
    this.foundation_.setVerticalOrientation(value)
  }

  set wrapFocus(value) {
    this.foundation_.setWrapFocus(value)
  }

  get classes() {
    const {
      avatarList,
      className,
      dense,
      nonInteractive,
      twoLine,
    } = this.props

    return cls('mdc-list', className, {
      'mdc-list--non-interactive': nonInteractive,
      'mdc-list--two-line': twoLine,
      'mdc-list--dense': dense,
      'mdc-list--avatar-list': avatarList,
    })
  }

  get orientation() {
    const {vertical} = this.props
    return vertical ? "vertical" : "horizontal"
  }

  get otherProps() {
    const {
      avatarList,
      className,
      dense,
      innerRef,
      nonInteractive,
      singleSelection,
      twoLine,
      vertical,
      wrapFocus,
      ...otherProps,
    } = this.props

    return otherProps
  }

  get adapter() {
    return {
      getListItemCount: () => {
        const count = this.state.items.length
        return count
      },
      getFocusedElementIndex: () => {
        let index = -1
        this.listElements_.map((ele, i) => {
          if (ele.current === document.activeElement) {
            index = i
          }
          return null
        })
        return index
      },
      getListItemIndex: (node) => {
        let index = -1
        this.listElements_.map((ele, i) => {
          if (ele.current === node) {
            index = i
          }
          return null
        })
        return index
      },
      setAttributeForElementIndex: (index, attr, value) => {
        const {items} = this.state
        const item = items[index]
        if (item) {
          const propMap = new Map(item.propMap)
          switch (attr) {
            case 'aria-selected':
              propMap.set('selected', value)
              break
            case 'tabindex':
              propMap.set('tabIndex', value)
              break
            default:
              propMap.set(attr, value)
          }
          items[index].propMap = propMap
          this.setState({ items })
        }
      },
      removeAttributeForElementIndex: (index, attr, value) => {
        const {items} = this.state
        const item = items[index]
        if (item) {
          const propMap = new Map(item.propMap)
          switch (attr) {
            case 'aria-selected':
              propMap.delete('selected')
              break
            case 'tabindex':
              propMap.delete('tabIndex')
              break
            default:
              propMap.delete(attr)
          }
          items[index].propMap = propMap
          this.setState({ items })
        }
      },
      focusItemAtIndex: (index) => {
        const item = this.listElements_[index]
        item && item.current.focus()
      },
      isListItem: (ele) => {
        let index = -1
        this.listElements_.forEach((listEle, i) => {
          if (listEle.current === ele) {
            index = i
          }
        })
        return index === -1 ? false : true
      },
    }
  }

  render() {
    const {innerRef} = this.props
    return (
      // eslint-disable-next-line jsx-a11y/role-supports-aria-props
      <ul
        {...this.otherProps}
        className={this.classes}
        aria-orientation={this.orientation}
        ref={node => {
          this.root_ = node
          innerRef(node)
        }}
      >
        {this.renderItems()}
      </ul>
    )
  }

  renderItems() {
    const {items} = this.state
    return items.map((item, index) => {
      const element = this.getItemElement(item)
      return React.cloneElement(
        element,
        {key: item.id, innerRef: this.listElements_[index]},
      )
    })
  }
}

List.propTypes = {
  avatarList: PropTypes.bool,
  className: PropTypes.string,
  dense: PropTypes.bool,
  innerRef: PropTypes.func,
  nonInteractive: PropTypes.bool,
  singleSelection: PropTypes.bool,
  twoLine: PropTypes.bool,
  vertical: PropTypes.bool,
  wrapFocus: PropTypes.bool,
}

List.defaultProps = {
  avatarList: false,
  className: '',
  dense: false,
  innerRef: () => {},
  nonInteractive: false,
  singleSelection: false,
  twoLine: false,
  vertical: true,
  wrapFocus: false,
}

export default List
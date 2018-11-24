import * as React from 'react'
import cls from 'classnames'
import { Link } from 'react-router-dom'
import List from 'components/mdc/List'
import AppleIconButton from 'components/AppleIconButton'
import ListAppleButton from 'components/ListAppleButton'
import ListEnrollButton from 'components/ListEnrollButton'
import Counter from 'components/Counter'
import Icon from 'components/Icon'
import Menu, {Corner} from 'components/mdc/Menu'
import {filterDefinedReactChildren, get, getHandleClickLink, timeDifferenceForDate} from 'utils'

class CardStudyPreview extends React.Component {
  state = {
    anchorElement: null,
    menuOpen: false,
  }

  setAnchorElement = (el) => {
    if (this.state.anchorElement) {
      return
    }
    this.setState({anchorElement: el})
  }

  get classes() {
    const {className} = this.props
    return cls("CardStudyPreview mdc-card", className)
  }

  render() {
    const {anchorElement, menuOpen} = this.state
    const study = get(this.props, "study", {})

    return (
      <div className={this.classes}>
        <Link className="mdc-card__primary-action" to={study.resourcePath}>
          <div className="rn-card__header">
            <Icon as="span" className="rn-card__header__graphic" icon="study" />
            <div className="rn-card__text">
              <h6 className="rn-card__title">
                {study.name}
              </h6>
              <div className="rn-card__subtitle">
                Created {timeDifferenceForDate(study.createdAt)} by
                <span className="ml1">{get(study, "owner.login", "")}</span>
              </div>
            </div>
          </div>
          <div className="rn-card__body rn-card__body-2">
            {study.description}
          </div>
        </Link>
        <div className="mdc-card__actions rn-card__actions bottom">
          <div className="mdc-card__action-buttons">
            <Link
              className="mdc-button mdc-card__action mdc-card__action--button"
              to={study.resourcePath}
            >
              Explore
            </Link>
          </div>
          <div className="mdc-card__action-icons rn-card__actions--spread">
            {study.viewerCanApple &&
            <AppleIconButton
              className="mdc-card__action mdc-card__action--icon"
              appleable={get(this.props, "study", null)}
            />}
            <Link
              className="mdc-button mdc-card__action mdc-card__action--button"
              to={study.resourcePath+"/lessons"}
              aria-label="Lessons"
              title="Lessons"
            >
              <Icon className="mdc-button__icon" icon="lesson" />
              {get(study, "lessons.totalCount", 0)}
            </Link>
          </div>
          <div className="mdc-card__action-icons rn-card__actions--collapsed">
            <Menu.Anchor innerRef={this.setAnchorElement}>
              <button
                type="button"
                className="mdc-icon-button material-icons"
                onClick={() => this.setState({menuOpen: !menuOpen})}
              >
                more_vert
              </button>
              <Menu
                open={menuOpen}
                onClose={() => this.setState({menuOpen: false})}
                anchorElement={anchorElement}
                anchorCorner={Corner.BOTTOM_LEFT}
              >
                {this.renderMenuList()}
              </Menu>
            </Menu.Anchor>
          </div>
        </div>
      </div>
    )
  }

  renderMenuList() {
    const study = get(this.props, "study", {})

    const listItems = [
      study.viewerCanEnroll &&
      <ListEnrollButton enrollable={this.props.study} />,
      study.viewerCanApple &&
      <ListAppleButton appleable={get(this.props, "study", null)} />,
      <List.Item onClick={getHandleClickLink(study.resourcePath+"/lessons")}>
        <List.Item.Graphic graphic={
          <Icon className="mdc-theme--text-icon-on-background" icon="lesson" />
        } />
        <List.Item.Text primaryText={
          <span>
            Lessons
            <Counter>{get(study, "lessons.totalCount", 0)}</Counter>
          </span>
        }/>
      </List.Item>,
    ]

    return <List items={filterDefinedReactChildren(listItems)} />
  }
}

export default CardStudyPreview

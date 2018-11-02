import * as React from 'react'
import cls from 'classnames'
import moment from 'moment'
import { Link } from 'react-router-dom'
import AppleIconButton from 'components/AppleIconButton'
import EnrollIconButton from 'components/EnrollIconButton'
import ListAppleButton from 'components/ListAppleButton'
import ListEnrollButton from 'components/ListEnrollButton'
import Counter from 'components/Counter'
import Icon from 'components/Icon'
import List from 'components/List'
import Menu, {Corner} from 'components/mdc/Menu'
import { get } from 'utils'

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
                Created on
                <span className="mh1">{moment(study.createdAt).format("MMM D, YYYY")}</span>
                by
                <span className="ml1">{get(study, "owner.login", "")}</span>
              </div>
            </div>
          </div>
          <div className="rn-card__body">
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
            {study.viewerCanEnroll &&
            <EnrollIconButton
              className="mdc-card__action mdc-card__action--icon"
              enrollable={get(this.props, "study", null)}
            />}
            {study.viewerCanApple &&
            <AppleIconButton
              className="mdc-card__action mdc-card__action--icon"
              appleable={get(this.props, "study", null)}
            />}
            <Link
              className="rn-icon-link mdc-card__action mdc-card__action--icon"
              to={study.resourcePath+"/lessons"}
            >
              <Icon className="rn-icon-link__icon" icon="lesson" />
              {get(study, "lessons.totalCount", 0)}
            </Link>
          </div>
          <Menu.Anchor className="mdc-card__action-icons rn-card__actions--collapsed" innerRef={this.setAnchorElement}>
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
              <List>
                {study.viewerCanEnroll &&
                <ListEnrollButton enrollable={this.props.study} />}
                {study.viewerCanApple &&
                <ListAppleButton
                  className="mdc-list-item"
                  appleable={get(this.props, "study", null)}
                />}
                <Link
                  className="mdc-list-item"
                  to={study.resourcePath+"/lessons"}
                >
                  <Icon className="mdc-list-item__graphic mdc-theme--text-icon-on-background" icon="lesson" />
                  <span className="mdc-list-item__text">
                    Lessons
                    <Counter>{get(study, "lessons.totalCount", 0)}</Counter>
                  </span>
                </Link>
              </List>
            </Menu>
          </Menu.Anchor>
        </div>
      </div>
    )
  }
}

export default CardStudyPreview

import * as React from 'react'
import cls from 'classnames'
import moment from 'moment'
import { Link } from 'react-router-dom'
import AppleIconButton from 'components/AppleIconButton'
import EnrollIconButton from 'components/EnrollIconButton'
import Icon from 'components/Icon'
import { get } from 'utils'

class CardStudyPreview extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("CardStudyPreview mdc-card", className)
  }

  render() {
    const study = get(this.props, "study", {})
    return (
      <div className={this.classes}>
        <Link className="mdc-card__primary-action" to={study.resourcePath}>
          <div className="pa3">
            <h6>{study.name}</h6>
            <div className="mdc-typography--subtitle2 mdc-theme--text-secondary-on-light">
              Created on
              <span className="mh1">{moment(study.createdAt).format("MMM D, YYYY")}</span>
              by
              <span className="ml1">{get(study, "owner.login", "")}</span>
            </div>
          </div>
          <div className="mdc-typography--body2 ph3 pb2">
            {study.description}
          </div>
        </Link>
        <div className="mdc-card__actions bottom">
          <div className="mdc-card__action-buttons">
            <Link
              className="mdc-button mdc-card__action mdc-card__action--button"
              to={study.resourcePath}
            >
              Explore
            </Link>
          </div>
          <div className="mdc-card__action-icons">
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
        </div>
      </div>
    )
  }
}

export default CardStudyPreview

import * as React from 'react'
import cls from 'classnames'
import moment from 'moment'
import { Link } from 'react-router-dom'
import AppleButton from 'components/AppleButton'
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
            <AppleButton
              className="mdc-card__action mdc-card__action--button"
              appleable={get(this.props, "study", null)}
            />
          </div>
          <div className="mdc-card__action-icons">
            <Link
              className="rn-icon-link mdc-card__action mdc-card__action--icon"
              to={study.resourcePath}
            >
              <Icon className="rn-icon-link__icon" icon="lesson" />
              {get(study, "lessonCount", 0)}
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default CardStudyPreview

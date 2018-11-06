import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import HTML from 'components/HTML'
import {makeCancelable, throttle} from 'utils'

class Preview extends React.Component {
  state = {
    dirty: true,
    open: false,
    preview: "",
    request: {
      cancel() {}
    },
  }

  componentWillUnmount() {
    this.state.request.cancel()
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.open && this.props.open && this.state.dirty) {
      if (this.props.text !== "") {
        this.fetchPreview()
        this.setState({dirty: false})
      } else {
        this.setState({dirty: false, preview: ""})
      }
    } else if (this.props.text !== prevProps.text) {
      this.setState({dirty: true})
    }
  }

  fetchPreview = throttle(() => {
    this.setState({loading: true})
    const {studyId, text} = this.props

    const formData = new FormData()

    formData.append("text", text)

    const request = makeCancelable(fetch(
      process.env.REACT_APP_API_URL + "/preview?study=" + studyId,
      {
        method: "POST",
        body: formData,
        credentials: "include",
      }
    ))
    this.setState({request})


    return Promise.race([
      request.promise,
      new Promise((_, reject) =>
        setTimeout(() => {
          request.cancel()
          reject(new Error('timeout'))
        }, 7000)
      )
    ]).then((response) => {
      if (response.ok) {
        return response.text()
      }
      return Promise.reject(response.statusText)
    }).then((response) => {
      if (response) {
        try {
          const error = JSON.parse(response)
          if (error) {
            this.setState({
              dirty: true,
              error: error.error_description,
              loading: false,
              preview: "",
            })
          }
        } catch (error) {
          this.setState({
            loading: false,
            preview: response,
          })
        }
      }
    }).catch((error) => {
      console.error(error)
      this.setState({
        dirty: true,
        error,
        loading: false,
        preview: "Something went wrong",
      })
    })
  }, 3000)

  get classes() {
    const {className} = this.props
    return cls("Preview mdc-card", className)
  }

  render() {
    const {onPublish} = this.props

    return (
      <div className={this.classes}>
        <div className="Preview__body">
          {this.renderPreview()}
        </div>
        <div className="mdc-card__actions bottom">
          <div className="mdc-card__action-buttons">
            <button
              type="button"
              className="mdc-button mdc-button--unelevated mdc-card__action mdc-card__action--button"
              onClick={onPublish}
            >
              Publish draft
            </button>
          </div>
        </div>
      </div>
    )
  }

  renderPreview() {
    const {loading, preview} = this.state
    if (loading) {
      return <div className="mdc-theme--text-hint-on-light">Loading...</div>
    } else if (preview === "") {
      return <div className="mdc-theme--text-hint-on-light">Nothing to preview</div>
    }
    return <HTML html={preview} />
  }
}

Preview.propTypes = {
  onPublish: PropTypes.func,
  studyId: PropTypes.string,
  text: PropTypes.string,
}

Preview.defaultProps = {
  onPublish: () => {},
  studyId: "",
  text: "",
}

export default Preview

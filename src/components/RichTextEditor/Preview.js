import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import HTML from 'components/HTML'
import {makeCancelable} from 'utils'

class Preview extends React.Component {
  state = {
    dirty: false,
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
    if (this.props.open && !prevProps.open && this.state.dirty) {
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

  fetchPreview = () => {
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

    request.promise.then((response) => {
      return response.text()
    }).then((preview) => {
      this.setState({
        loading: false,
        preview,
      })
    }).catch((error) => {
      console.error(error)
      return
    })
  }

  get classes() {
    const {className} = this.props
    return cls("Preview", className)
  }

  render() {
    return (
      <div className={this.classes}>
        {this.renderPreview()}
      </div>
    )
  }

  renderPreview() {
    const {dirty, loading, preview} = this.state
    if (loading) {
      return <div className="mdc-theme--text-hint-on-light">Loading...</div>
    } else if (dirty) {
      return <div />
    } else if (preview === "") {
      return <div className="mdc-theme--text-hint-on-light">Nothing to preview</div>
    }
    return <HTML html={preview} />
  }
}

Preview.propTypes = {
  studyId: PropTypes.string,
  text: PropTypes.string,
}

Preview.defaultProps = {
  studyId: "",
  text: "",
}

export default Preview

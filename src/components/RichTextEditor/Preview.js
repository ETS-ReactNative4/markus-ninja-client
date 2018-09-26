import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import HTML from 'components/HTML'
import { isNil, makeCancelable } from 'utils'
import { getAuthHeader } from 'auth'

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

    const Authorization = getAuthHeader()
    if (isNil(Authorization)) { return }
    const formData = new FormData()

    formData.append("text", text)

    const request = makeCancelable(fetch(
      process.env.REACT_APP_API_URL + "/preview?study=" + studyId,
      {
        method: "POST",
        headers: {
          Authorization,
        },
        body: formData,
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

  get preview() {
    const {dirty, loading, preview} = this.state
    if (loading) {
      return "Loading..."
    } else if (dirty) {
      return ""
    } else if (preview === "") {
      return "Nothing to preview"
    }
    return preview
  }

  render() {
    return (
      <div className={this.classes}>
        <HTML html={this.preview} />
      </div>
    )
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

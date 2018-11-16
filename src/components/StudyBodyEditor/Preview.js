import * as React from 'react'
import PropTypes from 'prop-types'
import HTML from 'components/HTML'
import {makeCancelable, throttle} from 'utils'

import Context from './Context'

class Preview extends React.Component {
  state = {
    dirty: true,
    open: false,
    preview: this.props.initialPreview,
    request: {
      cancel() {}
    },
  }

  componentWillUnmount() {
    this.state.request.cancel()
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.open && this.props.open) {
      if (this.state.dirty) {
        if (this.props.text !== "") {
          this.fetchPreview()
          this.setState({dirty: false})
        } else {
          this.setState({dirty: false, preview: ""})
        }
      }
    } else if (this.props.text !== prevProps.text) {
      this.setState({
        dirty: true,
      })
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

  render() {
    const {loading, preview} = this.state

    if (loading) {
      return (
        <div className="rn-loading">
          <HTML html={preview} />
        </div>
      )
    } else if (preview === "") {
      return <div className="mdc-theme--text-hint-on-light">Nothing to preview</div>
    }
    return <HTML html={preview} />
  }
}

Preview.propTypes = {
  handleChangeTab: PropTypes.func,
  onPublish: PropTypes.func,
  studyId: PropTypes.string,
  text: PropTypes.string,
}

Preview.defaultProps = {
  handleChangeTab: () => {},
  onPublish: () => {},
  studyId: "",
  text: "",
}

Preview.contextType = Context

export default Preview

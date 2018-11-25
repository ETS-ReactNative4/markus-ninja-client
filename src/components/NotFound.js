import * as React from 'react'
import {Link} from 'react-router-dom'

const NotFound = () => (
  <div className="rn-page flex items-center justify-center">
    <div className="mw6">
      <h4 className="ttu ma0">
        404 Page Not Found
      </h4>
      <h6>
        You may not have permission to see this page.
        <Link className="rn-link rn-link--underlined ml1" to="signin">Sign in.</Link>
      </h6>
      <p>
        Check that you typed the address correctly,
        go back to your previous page or try using
        our site search to find something specific.
      </p>
    </div>
  </div>
)

export default NotFound

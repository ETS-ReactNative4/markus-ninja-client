import * as React from 'react'
import {Link} from 'react-router-dom'

const NotFound = () => (
  <div className="rn-page mdc-layout-grid rn-page__grid--fill">
    <div className="mdc-layout-grid__inner">
      <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
        <div className="flex items-center justify-center mw6 center h-100">
          <div>
            <h4 className="ttu">
              404 Page Not Found
            </h4>
            <p className="mb3">
              You may not have permission to see this page.
              <Link className="rn-link ml1" to="/signin">Sign in.</Link>
            </p>
            <p>
              Check that you typed the address correctly,
              go back to your previous page or try using
              our site search to find something specific.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default NotFound

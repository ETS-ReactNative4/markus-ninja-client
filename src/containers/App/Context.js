import * as React from 'react'

export default React.createContext({
  isAuthenticated: () => {},
  isLoadingViewer: false,
  refetchViewer: () => {},
  removeViewer: () => {},
  viewer: {},
})

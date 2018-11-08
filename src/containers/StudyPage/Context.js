import * as React from 'react'

export default React.createContext({
  createLessonDialogOpen: false,
  createUserAssetDialogOpen: false,
  toggleCreateLessonDialog: () => {},
  toggleCreateUserAssetDialog: () => {},
})

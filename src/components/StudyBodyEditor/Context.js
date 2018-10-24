import * as React from 'react'
import {
  EditorState,
} from 'draft-js'

export default React.createContext({
  editorState: EditorState.createEmpty(),
  onChange: () => {},
  saveFileDialogOpen: false,
  toggleSaveDialog: () => {},
})

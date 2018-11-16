import * as React from 'react'
import {
  EditorState,
} from 'draft-js'

export default React.createContext({
  clearText: () => {},
  editorState: EditorState.createEmpty(),
  onChange: () => {},
  saveFileDialogOpen: false,
  show: "",
  showDraft: () => {},
  showPreview: () => {},
  toggleSaveDialog: () => {},
})

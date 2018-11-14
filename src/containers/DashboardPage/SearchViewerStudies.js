import * as React from 'react'
import cls from 'classnames'
import TextField, {Icon, Input} from '@material/react-text-field'
import UserStudies from 'components/UserStudies'
import ViewerStudies from './ViewerStudies'

class SearchViewerStudies extends React.Component {
  state = {
    error: null,
    q: "",
  }

  handleChange = (e) => {
    this.setState({q: e.target.value})
  }

  get classes() {
    const {className} = this.props
    return cls("SearchViewerStudies", className)
  }

  get filterBy_() {
    const {q} = this.state
    return {search: q}
  }

  render() {
    return (
      <div className={this.classes}>
        <div className="mh3">
          {this.renderInput()}
        </div>
        <UserStudies isViewer fragment="link" count={3} filterBy={this.filterBy_}>
          <ViewerStudies />
        </UserStudies>
      </div>
    )
  }

  renderInput() {
    const {q} = this.state

    return (
      <TextField
        fullWidth
        label="Find a study..."
        trailingIcon={<Icon><i className="material-icons">search</i></Icon>}
      >
        <Input
          name="q"
          autoComplete="off"
          placeholder="Find a study..."
          value={q}
          onChange={this.handleChange}
        />
      </TextField>
    )
  }
}

export default SearchViewerStudies

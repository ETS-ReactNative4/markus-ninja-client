import * as React from 'react'
import { Link } from 'react-router-dom'
import List from 'components/List'
import ListItem from 'components/ListItem/ListItem'

class WelcomePage extends React.Component {
  render() {
    return (
      <div className="WelcomePage">
        <h2>Welcome</h2>
        <Link to="/login">
          Already have an account?
        </Link>
        {` `}
        <Link to="/signup">
          Need to create an account?
        </Link>
        <List singleSelection={true}>
          <ListItem>One</ListItem>
          <ListItem>Two</ListItem>
          <ListItem>Three</ListItem>
        </List>
      </div>
    )
  }
}

export default WelcomePage

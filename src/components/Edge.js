import { get } from 'utils'

const Edge = ({ edge, render }) => {
  if (!get(edge, "node", null)) {
    return null
  }
  return render(edge)
}

export default Edge

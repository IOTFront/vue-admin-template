const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  users: state => state.user.users,
  name: state => state.user.name,
  roles: state => state.user.roles
}
export default getters

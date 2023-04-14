import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'activeUser',
  initialState: {
    zoteroToken: null,
    selectedTagIds: [],
    workspaces: []
  },
  reducers: {
    setProfile (state, data) {
      const { user } = data.payload
      if (user) {
        return {
          ...state.activeUser,
          ...user
        }
      }
    }
  }
})

export const { setProfile } = userSlice.actions
export default userSlice.reducer

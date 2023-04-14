import { createSlice } from '@reduxjs/toolkit'
const { SNOWPACK_SESSION_STORAGE_ID: sessionTokenName = 'sessionToken' } = import.meta.env

const sessionTokenSlice = createSlice({
  name: 'sessionToken',
  initialState: localStorage.getItem(sessionTokenName)
})

export default sessionTokenSlice.reducer

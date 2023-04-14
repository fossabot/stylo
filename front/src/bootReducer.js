import { createSlice } from '@reduxjs/toolkit'

const bootSlice = createSlice({
  name: 'hasBooted',
  initialState: false,
  reducers: {
    applicationStarted () {
      return true
    },
  }
})

export const { applicationStarted } = bootSlice.actions
export default bootSlice.reducer

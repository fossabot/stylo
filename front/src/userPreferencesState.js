import { createSlice } from '@reduxjs/toolkit'

export const userPreferencesSlice = createSlice({
  name: 'userPreferences',
  initialState: localStorage.getItem('userPreferences') ? JSON.parse(localStorage.getItem('userPreferences')) : {
    // The user we impersonate
    currentUser: null, trackingConsent: true /* default value should be false */
  }
})

export default userPreferencesSlice.reducer

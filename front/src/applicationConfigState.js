import { createSlice } from '@reduxjs/toolkit'

const applicationConfigSlice = createSlice({
  name: 'applicationConfig',
  initialState: {
    backendEndpoint: import.meta.env.SNOWPACK_PUBLIC_BACKEND_ENDPOINT,
    graphqlEndpoint: import.meta.env.SNOWPACK_PUBLIC_GRAPHQL_ENDPOINT,
    exportEndpoint: import.meta.env.SNOWPACK_PUBLIC_EXPORT_ENDPOINT,
    processEndpoint: import.meta.env.SNOWPACK_PUBLIC_PROCESS_ENDPOINT,
    pandocExportEndpoint: import.meta.env.SNOWPACK_PUBLIC_PANDOC_EXPORT_ENDPOINT,
    humanIdRegisterEndpoint: import.meta.env.SNOWPACK_PUBLIC_HUMAN_ID_REGISTER_ENDPOINT,
  },
  reducers: {
    setApplicationConfig (state, data) {
      return data.payload
    },
  }
})

export const { setApplicationConfig } = applicationConfigSlice.actions
export default applicationConfigSlice.reducer

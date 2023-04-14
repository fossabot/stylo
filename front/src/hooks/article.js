import useSWR from 'swr'
import askGraphQL from '../helpers/graphQL.js'
import { getUserArticles, getWorkspaceArticles } from '../components/Articles.graphql'
import { shallowEqual, useSelector } from 'react-redux'
import { print } from 'graphql/language/printer.js'

const fetcher = (data) => {
  const query = typeof data.query === 'string' ? data.query : print(data.query)
  return askGraphQL({
      query,
      variables: data.variables
    },
    null,
    data.sessionToken,
    { graphqlEndpoint: data.graphqlEndpoint }
  )
}

export function useArticles ({ userId, workspaceId }) {
  const sessionToken = useSelector(state => state.sessionToken)
  const graphqlEndpoint = useSelector(state => state.applicationConfig.graphqlEndpoint, shallowEqual)
  const variables = workspaceId
    ? { userId, workspaceId }
    : { userId }

  const query = workspaceId
    ? getWorkspaceArticles
    : getUserArticles

  const { data, error } = useSWR(
    { graphqlEndpoint, sessionToken, query, variables },
    fetcher
  )
  return { data, error }
}

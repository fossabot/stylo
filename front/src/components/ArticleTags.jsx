import React from 'react'
import { computed, useSignal } from '@preact/signals-react'

import { useGraphQL } from '../helpers/graphQL'
import ArticleTag from './Tag'
import { addTags, removeTags } from './Articles.graphql'
import { shallowEqual, useSelector } from 'react-redux'

export default function ArticleTags ({ articleId, tags, userTags, onTagsUpdated }) {

  const runQuery = useGraphQL()
  const activeUser = useSelector(state => state.activeUser, shallowEqual)
  const articleTags = useSignal(tags)
  const selectedTagIds = computed(() => articleTags.value.map(({ _id }) => _id))

  const handleClick = async (event) => {
    const [id, checked] = [event.target.value, event.target.checked]
    const variables = { article: articleId, tags: [id], user: activeUser._id }

    const query = checked ? addTags : removeTags
    await runQuery({ query, variables })
    const selectedTag = userTags.value.find((t) => t._id === id)

    if (checked) {
      articleTags.value = [...articleTags.value, selectedTag]
    } else {
      articleTags.value = articleTags.value.filter((t) => t._id !== id)
    }
    onTagsUpdated({ articleId, tags: articleTags.value })
  }

  return (
    <ul>
      {userTags.value.map((tag) => (
        <li key={`article-${articleId}-${tag._id}`}>
          <ArticleTag tag={tag} selected={selectedTagIds.value.includes(tag._id)} onClick={handleClick}/>
        </li>
      ))}
    </ul>
  )
}

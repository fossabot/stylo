import { useToasts } from '@geist-ui/core'
import debounce from 'lodash.debounce'
import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from '../../hooks/graphql.js'
import CorpusArticleCard from './CorpusArticleCard.jsx'

import { updateArticlesOrder } from './Corpus.graphql'

import styles from './corpusArticleItems.module.scss'

export default function CorpusArticleItems ({ corpusId, articles }) {
  const [articleCards, setArticleCards] = useState(articles.map((a) => a.article))
  const mutation = useMutation()
  const { setToast } = useToasts()
  const { t } = useTranslation()

  const updateArticleOrder = useCallback(debounce(
    async (orderedArticles) => {
      const articlesOrderInput = orderedArticles.map((item, index) => ({ articleId: item._id, order: index }))
      try {
        await mutation({ query: updateArticlesOrder, variables: { corpusId, articlesOrderInput } })
        setToast({
          type: 'default',
          text: t('corpus.articlesOrder.toastSuccess')
        })
      } catch (err) {
        setToast({
          type: 'error',
          text: t('corpus.articlesOrder.toastFailure', {errorMessage: err.toString()})
        })
      }
    },
    750,
    { leading: false, trailing: true }
  ), [])

  const moveArticleCard = useCallback((dragIndex, hoverIndex) => {
    setArticleCards((prevCards) => {
      const length = prevCards.length
      const position = hoverIndex < dragIndex
        ? { startIndex: hoverIndex, endIndex: dragIndex }
        : { startIndex: dragIndex, endIndex: hoverIndex }
      const orderedArticles = [
        ...prevCards.slice(0, position.startIndex),
        prevCards[position.endIndex],
        ...prevCards.slice(position.startIndex + 1, position.endIndex),
        prevCards[position.startIndex],
        ...prevCards.slice(position.endIndex + 1, length),
      ]
      updateArticleOrder(orderedArticles)
      return orderedArticles
    })
  }, [])
  const renderCard = useCallback((card, index) => {
    return (
      <CorpusArticleCard
        key={card._id}
        index={index}
        id={card._id}
        article={card}
        moveCard={(dragIndex, hoverIndex) => {
          moveArticleCard(dragIndex, hoverIndex)
        }}
      />
    )
  }, [])
  return <div className={styles.container}>{articleCards.map((card, i) => renderCard(card, i))}</div>
}

CorpusArticleItems.propTypes = {
  corpusId: PropTypes.string,
  articles: PropTypes.array,
}

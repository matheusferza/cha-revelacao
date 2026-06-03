import { collection, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore'
import { useCallback, useEffect, useState } from 'react'
import { db, isFirebaseConfigured } from '../lib/firebase'

type SharedItem = {
  id: string
}

const emptyItems: never[] = []

function readLocalItems<T>(storageKey: string, fallbackItems: T[]) {
  const saved = localStorage.getItem(storageKey)
  return saved ? (JSON.parse(saved) as T[]) : fallbackItems
}

export function useSharedCollection<T extends SharedItem>(
  collectionName: string,
  storageKey: string,
  fallbackItems: T[] = emptyItems,
) {
  const isDemo = !isFirebaseConfigured || !db
  const [items, setItems] = useState<T[]>(() => (isDemo ? readLocalItems(storageKey, fallbackItems) : fallbackItems))

  useEffect(() => {
    if (isDemo || !db) return

    return onSnapshot(collection(db, collectionName), (snapshot) => {
      const remoteItems = snapshot.docs.map((snapshotDoc) => ({ ...snapshotDoc.data(), id: snapshotDoc.id }) as T)
      setItems(remoteItems)
    })
  }, [collectionName, fallbackItems, isDemo])

  const upsertItem = useCallback(
    async (item: T) => {
      if (isDemo || !db) {
        setItems((currentItems) => {
          const nextItems = currentItems.some((currentItem) => currentItem.id === item.id)
            ? currentItems.map((currentItem) => (currentItem.id === item.id ? item : currentItem))
            : [...currentItems, item]
          localStorage.setItem(storageKey, JSON.stringify(nextItems))
          return nextItems
        })
        return
      }

      await setDoc(doc(db, collectionName, item.id), item)
    },
    [collectionName, isDemo, storageKey],
  )

  const removeItem = useCallback(
    async (id: string) => {
      if (isDemo || !db) {
        setItems((currentItems) => {
          const nextItems = currentItems.filter((item) => item.id !== id)
          localStorage.setItem(storageKey, JSON.stringify(nextItems))
          return nextItems
        })
        return
      }

      await deleteDoc(doc(db, collectionName, id))
    },
    [collectionName, isDemo, storageKey],
  )

  return { items, removeItem, upsertItem }
}

import { getDatabase, onValue, ref } from 'firebase/database'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import FriendCard from 'src/components/FriendCard/FriendCard'
import '../Friend/friend.style.scss'
function Search() {
  const [searchResult, setSearchResult] = useState(null)
  const location = useLocation()
  const name = location.search.split('?=')[1]
  const user = useSelector(state => state.auth?.user)
  const friend = useSelector(state => state.friend?.friend?.list)

  useEffect(() => {
    let data = []
    if (name) {
      onValue(ref(getDatabase(), '/users'), snapshot => {
        snapshot.forEach(snap => {
          if (
            snap.val().name.toLowerCase().includes(name.toLowerCase()) &&
            name !== ''
          ) {
            if (friend && friend[0]?.value) {
              if (
                friend?.findIndex(item => item.value.userId === snap.key) !== -1
              ) {
                let index = friend?.findIndex(
                  item => item.value.userId === snap.key
                )
                data = [
                  ...data,
                  {
                    userId: snap.key,
                    confirm: friend[index]?.value?.confirm,
                    userKey: friend[index]?.id,
                    friendKey: friend[index]?.value?.friendKey
                  }
                ]
              } else {
                data = [
                  ...data,
                  {
                    userId: snap.key,
                    confirm: 'add'
                  }
                ]
              }
            } else {
              data = [
                ...data,
                {
                  userId: snap.key,
                  confirm: 'add'
                }
              ]
            }
          }
        })
        return setSearchResult([...data])
      })
    }
  }, [name, friend, user.uid])
  return (
    <div className="friend">
      {searchResult ? (
        searchResult?.map((item, index) =>
          item.userId === user?.uid ? (
            <FriendCard
              key={index}
              userId={item.userId}
              my={true}
              friendId={user?.friendId}
              uid={user?.uid}
            />
          ) : (
            <FriendCard
              key={index}
              userId={item.userId}
              friendId={user?.friendId}
              uid={user?.uid}
              confirm={item.confirm}
              friendKey={item.friendKey}
              userKey={item.userKey}
            />
          )
        )
      ) : (
        <div className="loading-friend">No User...</div>
      )}
    </div>
  )
}

export default Search

import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Posts = () => {
  const {posts} = useSelector(state=>state.post)
  console.log("posts===",posts)

  return (
    <div>
      {posts?.map((post,i)=>(
        <Post key={i} post={post}/>
      ))
}    </div>
  )
}

export default Posts

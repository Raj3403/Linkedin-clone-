import React from 'react'
import PostStatus from './Common/PostUpdate';
import "../Sass/HomeComponent.scss";

function HomeComponent({currentUser}) {
  return (
    <div className='home-component'>
      <PostStatus currentUser = {currentUser}/>
    </div>
  )
}

export default HomeComponent

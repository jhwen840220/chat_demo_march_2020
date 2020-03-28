import React from 'react'
const { useState } = React;
import { ContextStore } from 'stores/index';

import styled from '@emotion/styled';
import { Avatar } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search'
import moment from 'moment'
import { getData_byFB } from 'actions/basicActions'

import { SearchModal } from 'components'

const SearchBlock = (props) => {
  const name = localStorage.getItem('name') || ''
  // const { friend, onSelectedFriend, selectFriend } = props;
  const [searchTxt, setSearchTxt] = useState(''); 
  const [modalVisible, setModalVisible] = useState(false);
  const [friendInfo, setFriendInfo] = useState(null);

  const handleSearchTxt = (e) => {
    setSearchTxt(e.target.value)
  }
  const handleSearch = async(e) => {
    e.preventDefault();
    if(!searchTxt.length) return;
    if(searchTxt != name) {
      const friendInfoPayload = await getData_byFB(`/users/${searchTxt}`) || null

      if(friendInfoPayload) {
        setFriendInfo(friendInfoPayload);
      }
      else {
        setFriendInfo(null);
      }
      
    }
    else {
      setFriendInfo('me')
    }
    setModalVisible(true);

    return;
  }

  const handleModalVisible = (val) => {
    setModalVisible(val)
  }
  return (
    <SearchForm 
      onSubmit={handleSearch}
    >
      <SearchIcon />
      <input type="text" value={searchTxt} onChange={handleSearchTxt} />
      <SearchModal 
        visible={modalVisible} 
        setVisible={handleModalVisible}
        friendInfo={friendInfo}
        />
    </SearchForm>
  )
}


export default SearchBlock

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  border-bottom: 1px solid lightgray;
  padding: 10px;
  input {
    flex: 1;
    outline: none;
    border: 0;
  }
`
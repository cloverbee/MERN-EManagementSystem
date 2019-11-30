import axios from 'axios';
import { func } from 'prop-types';

function initRequestStart() {
  return {
    type: 'USER_INIT_FETCH'
  };
}
function cleanState(curpage) {
  return {
    type: "CLEAN_LIST_STATE",
    cleanPage: curpage,// clean tail data only leave data before curpage
  };
}
function requestListStart() {
    return {
      type: 'USER_FETCH_START'
    };
  }
function requestListSuccess(response) {
    return {
      type: 'USER_FETCH_SUCCESS',
      data: response.data,
      //pageNum: response.pageNum, //from db
      //hasMore: response.data.hasMore,
    };
  }
function requestListFail(error) {
    return {
      type: 'USER_FETCH_FAIL',
      error
    };
}
export function getUserList(curpage, pnum, limit, order, searchText = '') { //from dispatch action
    return (dispatch, getState) => {
      if(curpage === 0){
        console.log("Initial fetching.........................");
        dispatch(initRequestStart());
      }
      else{
        dispatch(cleanState(curpage));
        dispatch(requestListStart());
      }
      axios
        .get(`http://127.0.0.1:8080/api/users?PageNum=${curpage}&Num=${pnum}&Limit=${limit}&Order=${order}&SearchText=${searchText}`)
        .then(response => {
          dispatch(requestListSuccess(response));
        })
        .catch(error => {
          dispatch(requestListFail(error));
        });
    };
}

function createStart() {
  return {
    type: 'USER_CREATE_START'
  };
}
function createSuccess(response) {
  return {
    type: 'USER_CREATE_SUCCESS',
    data: response.data
  };
}
function createFail(error) {
  return {
    type: 'USER_CREATE_FAIL',
    error
  };
}
export const createSoldier = (user, history) => {
  return (dispatch, getState) => {
    dispatch(createStart());
    axios
      .post('http://127.0.0.1:8080/api/users/', user)
      .then(response => {
        dispatch(createSuccess(response));
        //dispatch(getUserList());
      })
      .then(() => {
        history.push('/');
      })
      .catch(error => {
        dispatch(createFail(error));
      });
  };
}
//get all the exist soldiers
function requestSuperiorStart() {
  return {
    type: 'SUPERIOR_FETCH_START'
  };
}
function requestSuperiorSuccess(response) {
  return {
    type: 'SUPERIOR_FETCH_SUCCESS',
    data: response.data,
    //pageNum: response.pageNum, //from db
    //hasMore: response.data.hasMore,
  };
}
function requestSuperiorFail(error) {
  return {
    type: 'SUPERIOR_FETCH_FAIL',
    error
  };
}
export function getSuperiorList(id) { //from dispatch action
  return (dispatch, getState) => {
    dispatch(requestSuperiorStart());
    axios
      .get(`http://127.0.0.1:8080/api/users/supierior/${id}`)
      .then(response => {
        dispatch(requestSuperiorSuccess(response));
      })
      .catch(error => {
        dispatch(requestSuperiorFail(error));
      });
  };
}


function searchSoldierStart() {
  return {
    type: 'SOLDIER_SEARCH_START'
  };
}
function searchSoldiersuccess(response) {
  return {
    type: 'SOLDIER_SEARCH_SUCCESS',
    data: response.data,
    //pageNum: response.pageNum, //from db
    //hasMore: response.data.hasMore,
  };
}
function searchSoldierFail(error) {
  return {
    type: 'SOLDIER_SEARCH_FAIL',
    error: error
  };
}
export function searchSoldier(id, searchText, superiorId) { //from dispatch action
  return (dispatch, getState) => {  //detail, searchText, Subordinates
    dispatch(searchSoldierStart());
    axios
      .get(`http://127.0.0.1:8080/api/search?searchId=${id}&searchText=${searchText}&superiorId=${superiorId}`)
      .then(response => {
        dispatch(searchSoldiersuccess(response));
      })
      .catch(error => {
        dispatch(searchSoldierFail(error));
      });
  };
}

function deleteStart() {
  return {
    type: 'USER_DELETE_START'
  };
}
function deleteSuccess(response) {
  return {
    type: 'USER_DELETE_SUCCESS',
    //data: response.data
  };
}
function deleteFail(error) {
  return {
    type: 'USER_DELETE_FAIL',
    error
  };
}
function updateDeletedNodeSuperior(superiorId){
  return {
    type: 'UPDATE_DELETENODE_SUPERIOR',
    superiorId: superiorId,
  }
}

function updateDeletedNodeDS(dsObjArrToUpdate, superiorId, id){
  return {
    type: 'UPDATE_DELETEDNODE_DS',
    superiorId: superiorId, //object
    dsObjArrToUpdate: dsObjArrToUpdate, //array of nodes
    deletedId: id
  }
}

export const deleteSoldier = (id, history, index, order, searchText, superiorId, dsObjArrToUpdate) => {
  return (dispatch, getState) => {
    dispatch(deleteStart());
    axios
      .delete(`http://127.0.0.1:8080/api/users/${id}`)
      .then(response => {
        dispatch(deleteSuccess(response));
      })
      .then(()=>{
        console.log('superiorId', superiorId);
        if(superiorId !== null && superiorId._id > id){////'<'
          dispatch(updateDeletedNodeSuperior(superiorId._id));
        }
        if(dsObjArrToUpdate.length > 0){
          console.log('action&&& filted to modify node',dsObjArrToUpdate.filter(node=> node._id > id))
          dispatch(updateDeletedNodeDS(dsObjArrToUpdate, superiorId, id));
        }
      })
      .then(()=>{
         dispatch( getUserList(Math.floor(index/3), 1, 3, order, searchText) );
         //getUserList(curpage, pnum, limit, order, searchText = '')
      })
      .then(()=>{
         //history.push('/');
        
        //console.log("getState", getState());
        //console.log("Number(index/3)", index/3);
        //////dispatch( getUserList( Math.floor(index/3), 3 ) );///ask for new page after current delete node
        ////////////////////dispatch( getUserList( 0, 3 * (Math.floor(index/3)-1)) );
      })
      .catch(error => {
        dispatch(deleteFail(error));
      });
  };
}

function getDetailStart() {
  return {
    type: 'GET_DETAIL_START'
  };
}
function getDetailSuccess(response) {
  return {
    type: 'GET_DETAIL_SUCCESS',
    data: response.data
  };
}
function getDetailFail(error) {
  return {
    type: 'GET_DETAIL_FAIL',
    error
  };
}
export const detailSoldier = (id, history) => {
  return (dispatch, getState) => {
    dispatch(getDetailStart());
    axios
      .get(`http://127.0.0.1:8080/api/users/${id}`)
      .then(response => {
        dispatch(getDetailSuccess(response));
        //dispatch(getUserList(0, 3));
      })
      .then(()=>{
        
      })
      .then(() => {
        history.push('/edit');
      })
      .catch(error => {
        dispatch(getDetailFail(error));
      });
  };
}

function editStart() {
  return {
    type: 'USER_EDIT_START'
  };
}
function editSuccess(response) {
  return {
    type: 'USER_EDIT_SUCCESS',
    //data: response.data
  };
}
function editFail(error) {
  return {
    type: 'USER_EDIT_FAIL',
    error
  };
}
export const editSoldier = (id, user, history) => {
  return (dispatch, getState) => {
    dispatch(editStart());
    axios
      .put(`http://127.0.0.1:8080/api/users/${id}`, user)
      .then(response => {
        dispatch(editSuccess(response));
        
      })
      .then(()=>{
        //dispatch(getUserList(0, 3));
      })
      .then(() => {
        history.push('/');
      })
      .catch(error => {
        dispatch(editFail(error));
      });
  };
}



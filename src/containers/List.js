
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import 'antd/dist/antd.css';
import '../index.css';
import {  message, Avatar, Spin, Button, Input, Icon} from 'antd';

import { Table, Divider,} from 'antd';
import {connect} from 'react-redux';
import * as actions from '../actions';


class InfiniteListExample extends React.Component {

    constructor(props){
        super(props);
        this.state = { order: "", input:""};
    }
    
    componentDidMount() {
        //this.fetchData(0, 3);
                 //getUserList(curpage, pnum, limit, order = '', searchText = '')
        this.props.getUserList(0, 1, 3, this.state.order, this.state.input);
        console.log("this.state.order", this.state.order);
    }

    handleAscending = () => {
        this.setState({order:"ascending"});
        //console.log("ASCENDING CLICKED!", this.state.order);
        //initState = {data: [], isFetching: false, error: '', PageNum: 0, Limit: 3, hasMore: true, Order:'', SearchText:""};
        this.props.getUserList(0, 1, 3, 'ascending', this.state.input);
        //getUserList(curpage, pnum, limit, order, searchText = '')
    }
    handleDescending = () => {
        this.setState({order:"descending"});
        this.props.getUserList(0, 1, 3, 'descending', this.state.input);
    }

    fetchData = (pn, limit) => {
        //console.log('CONTAINER FETch', "pageNum", pageNum);
        this.props.getUserList(pn, 1, limit, this.props.list.Order, this.props.list.SearchText);
    };

    handleInfiniteOnLoad = () => {
        const {hasMore, PageNum, Limit} = this.props.list;
        //console.log("handleInfiniteLoad", this.props.list.PageNum, this.props.list.Limit);
        if (!hasMore) {
            message.warning('Infinite List loaded all');
            return;
        }
        else {
            this.fetchData(PageNum, Limit);
        }
    };

    handleCreateClick = () => {
      this.props.history.push('/create');
    }

    handleClickSuperior = (superior) => {
        console.log("handleClickSuperior", superior);
        this.props.searchSoldier(superior._id);
    }
    handleClickDelete = (id, history, order, searchText) => {
        let tmpListId = this.props.list.data.map(node=> node._id);
        let index = tmpListId.indexOf(id);
        console.log("index of deleted node:---", index);
        
        let superiorId = this.props.list.data[index].superior;
        console.log("index of deleted node Superior :---", superiorId);//object
        
        let dsObjArrToUpdate = this.props.list.data.filter(node => node.superior && (node.superior._id === id));
        console.log("List of to Update deleted node`s  DS :---", dsObjArrToUpdate);
        
        this.props.deleteSoldier(id, history, index, order, searchText, superiorId, dsObjArrToUpdate);

        //const deleteSoldier = (id, history, index, order, searchText)
    }
    handleClickEdit = (id, history) => {
        this.props.detailSoldier(id, history);
        //this.props.history.push('/edit');
    }
    handleSearch = (input) => {
        console.log("INPUT", input);
        this.setState({input: input})
        if(input !== ''){
            //this.props.searchSoldier("", input, "");
            this.props.getUserList(0, 1, this.props.list.Limit, this.props.list.Order, input);
        }
    }
    handleClickDS = (superior) => {
        this.props.searchSoldier('','', superior);
    }
    handleReset = () => {
        this.setState({order:"", input:''})
        this.props.getUserList(0, 1, this.props.list.Limit,'', '');
        
    } 
    render() {
      const columns = [
        {
            title: 'I',
            dataIndex: '_id',
            key: '_id',
            render: (text, record, index) => (<div>{index}</div>),
        },
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (text, record) => (<Avatar src = {record.avatar}/>),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',

        },
        {
            title: 'Gender',
            dataIndex: 'sex',
            key: 'sex',
        },
        {
            title: 'Rank',
            dataIndex: 'rank',
            key: 'rank',
        },
        {
            title: 'Startdate',
            dataIndex: 'startdate',
            key: 'startdate',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            render: (text, record) => (
                <a href = {`tel: ${text}`}> {text} </a>
            )
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render:(text, record) => (
                <a href={`mailto: ${text}`} >{text}</a>
            )
        },
        {
            title: 'Superior',
            dataIndex: 'superior.name',
            key: 'superior',
            render:(text, record) => (
                <span>
                    <div onClick = {() => this.handleClickSuperior(record.superior, this.props.history)}>{text}</div>
                </span>
            )
        },
        {
            title: '# of DS',
            dataIndex: 'ds',
            key: 'ds',
            render:(text, record) => (
                <span>
                    <div onClick = {() => this.handleClickDS(record._id, this.props.history)}>{text}</div>
                </span>
            )
        },
        {
            title: "Action",
            key: "action",
            width: "200px",
            render: (text, record) => (
                    <span>
                        <Button style = {{width:"70px"}} onClick = {() => this.handleClickEdit(record._id, this.props.history)}>Edit </Button>
                        <Divider type="vertical" />
                        <Button  style = {{width:"70px"}} onClick = {() => this.handleClickDelete(record._id, this.props.history, this.props.list.Order, this.props.list.SearchText)}>Delete</Button>
                    </span>
            )
        }
      ];
    const {data, loading, hasMore} = this.props.list;
    //console.log("Container List", this.props.list);
    return (
      <div style = {{margin:"10px", width:"1000px"}}>
        <div style = {{margin:"10px"}}>
          <Input style = {{width:"950px"}} value = {this.state.input} placeholder="input search text... " onChange = {(e) => this.handleSearch(e.target.value)}/>

          <Icon type="sort-ascending" onClick = {()=> this.handleAscending()}  />
          <Icon type="sort-descending" onClick = {()=> this.handleDescending()}/>

          <Button type="primary" style = {{marginRight:"10px", marginTop :"5px"}} onClick = {this.handleCreateClick}>Create</Button>
          <Button type="default" style = {{background:'lightgreen'}}  onClick = {this.handleReset}>Reset</Button>
        </div>
        {/*<div style={{height:"600px", overflow:"auto"}} ref={(ref) => this.scrollParentRef = ref}> */}
        <div className="demo-infinite-container"> 
          <InfiniteScroll initialLoad={false} pageStart={0} loadMore={this.handleInfiniteOnLoad}
            hasMore={!loading && hasMore} useWindow={false}
          >
              <Table columns={columns} dataSource={data} pagination = {false} rowKey={record => record._id}>
                  {
                    loading && hasMore && (
                      <div className="demo-loading-container">
                          <Spin />
                      </div>
                  )}
              </Table>
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
    return {
        list: state.list,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        getUserList: (page, pnum, limit, order = '', searchText) => {
            //(curpage, pnum, limit, order = '', searchText = '') 
            dispatch(actions.getUserList(page, pnum, limit, order, searchText));
        },
        searchSoldier:(id, searchText, superiorId) => {
            dispatch(actions.searchSoldier(id, searchText, superiorId));
        },
        deleteSoldier:(id, history, index, order, searchText, superiorId, dsObjArrToUpdate) => {
            //const deleteSoldier = (id, history, index, order, searchText)
            dispatch(actions.deleteSoldier(id, history, index, order, searchText, superiorId, dsObjArrToUpdate));
        },
        detailSoldier:(id, history) => {
            dispatch(actions.detailSoldier(id, history));
        },
        /*sortSoldier:(order) => {//order is string
            dispatch(actions.getUserList(0, 3, order));
        }*/
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(InfiniteListExample);

          
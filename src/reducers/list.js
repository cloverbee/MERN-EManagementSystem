const initState = {data: [], isFetching: false, error: '', PageNum: 0, Limit: 3, hasMore: true, Order:'', SearchText:""};

function filterDuplicate(predata, data){
    let predataId = predata.map(node => node._id);
    let tmp = data.filter(node => predataId.indexOf(node._id) === -1);
    return tmp;
}

const list = (state = initState, action) => {
    switch (action.type){
            case "USER_INIT_FETCH":
                return {
                    ...state,
                    data:[],
                    error:{},
                    isFetching: true,
                }
            case 'CLEAN_LIST_STATE':
                return {
                    ...state,
                    data: state.data.slice(0, (action.cleanPage)* 3),
                }
            case "USER_FETCH_START":
                return {
                    //delete tail part
                    ...state,
                    data: state.data,//state.data.slice(0, -1*( (state.data.length)%state.limit) ),//(state.pageNum === 0)?[]:state.data,//////
                    error: {},
                    isFetching: true,
                }
            case "USER_FETCH_SUCCESS":
                console.log("+++++Reducer: action.data.nodes+++++ " , action.data.nodes)
                return {
                    ...state,
                    prevdata: state.data,
                    prevpage: state.pageNum,
                    isFetching: false,
                    data: state.data.concat(filterDuplicate(state.data, action.data.nodes)),//filterDuplicate(state.data, action.data.nodes)),
                    //((state.pageNum === action.data.pageNum - 1)&&(action.data.nodes.length !== 0))?state.data.concat(filterDuplicate(state.data, action.data.nodes)):state.data,
                    ///(action.data.pageNum === 0)||
                    error: {},
                    //pageNum: action.data.PageNum,//state.pageNum + 1,////?
                    hasMore: action.data.nodes.length !== 0,
                    PageNum:action.data.PageNum,///////////next time page begin point
                    Limit:action.data.Limit,//page size 
                    Order:action.data.Order,//sort name order
                    SearchText:action.data.SearchText,
                }
            case "USER_FETCH_FAIL":
                return {
                    ...state,
                    isFetching: false,
                    error: action.err,
                    hasMore: false,
                }
            case 'SOLDIER_SEARCH_START':
                return {
                    ...state,
                    isFetching: true,
                    data: [],  
                    error:{}
                }
            case 'SOLDIER_SEARCH_SUCCESS':
                return {
                    ...state,
                    isFetching: false,
                    data: action.data,//[]
                    error: {},
                }
            case 'SOLDIER_SEARCH_FAIL':
                return {
                    ...state,
                    isFetching: false,
                    data: [],
                    error: action.error,
                }
            case 'USER_DELETE_START':
                return {
                    ...state,
                    isFetching: true,
                    error:{}
                }
            case 'USER_DELETE_SUCCESS':
                return {
                    ...state,
                    isFetching: false,
                    error: {},
                }
            case 'USER_DELETE_FAIL':
                return {
                    ...state,
                    isFetching: false,
                    error: action.error,
                }  
            case 'UPDATE_DELETENODE_SUPERIOR':
                console.log('action.superiorId', action.superiorId);// just an id
                let renode = state.data.filter(node => node._id === action.superiorId)[0];
                let superiorIndex = state.data.map(node => node._id).indexOf(action.superiorId);
                console.log("update_deletenode_superior", renode);
                console.log("***********888ds - 1 **********");
                renode.ds -= 1;
                return {
                    ...state,
                    //superiorIndex
                    data: state.data.slice(0, superiorIndex).concat(renode).concat(state.data.slice(superiorIndex+1, )),
                }
            case 'UPDATE_DELETEDNODE_DS':
                //superiorId: superiorId, object 
                //dsObjArrToUpdate: dsObjArrToUpdate, array of  all ds nodes
                //deletedId: deletedId
                console.log("action.dsObjArrToUpdate", action.dsObjArrToUpdate);
                let arr = state.data;
                let superior = action.superiorId;//object 
                //arr.filter(node => node._id === action.superiorId._id)[0]//obj;
                for(let i = 0; i < action.dsObjArrToUpdate.length; i++){
                    for(let j = 0; j < arr.length; j++){
                        if((action.dsObjArrToUpdate[i]._id === arr[j]._id) && (arr[j]._id > action.deletedId)){
                            arr[j].superior = superior;
                        }
                    }
                }
                if(superior)
                {
                    let indexOfSuperior = arr.map(node => node._id).indexOf(superior._id);
                    arr[indexOfSuperior].ds += action.dsObjArrToUpdate.length;
                }
                return {
                    ...state,
                    data: arr,
                }
            case 'USER_CREATE_SUCCESS':
                return {
                    ...state,
                    data:[action.data]
                }  
            default :
                return state;
        }
}
export default list;

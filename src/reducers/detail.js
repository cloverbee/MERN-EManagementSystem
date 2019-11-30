
const initState = {data:null, err: '', isFetching: false};

const detail = (state = initState, action) => {
    switch (action.type) {
        case "GET_DETAIL_START":
            return {
                ...state,
                data: null,
                err: {},
                isFetching: true,
            }
        case "GET_DETAIL_SUCCESS":
            return {
                ...state,
                isFetching: false,
                data: action.data,
                err: {},
            }
        case "GET_DETAIL_FAIL":
            return {
                ...state,
                isFetching: false,
                err: action.err,
            }
       
        default :
            return state;
    }
}
export default detail;
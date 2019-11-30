
const initState = {data:[], err: '', isFetching: false};

const superior = (state = initState, action) => {
    switch (action.type) {
        case "SUPERIOR_FETCH_START":
            return {
                ...state,
                data: [],
                err: {},
                isFetching: true,
            }
        case "SUPERIOR_FETCH_SUCCESS":
            return {
                ...state,
                isFetching: false,
                data: action.data,
                err: {},
            }
        case "SUPERIOR_FETCH_FAIL":
            return {
                ...state,
                isFetching: false,
                err: action.err,
            }
       
        default :
            return state;
    }
}
export default superior;
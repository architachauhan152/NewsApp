// Context Creation
// Provider
// Consumer was vey lengthy process so they remove this instead of consumer we will use useContext hook
import React, { useContext, useReducer, useEffect } from "react";
import reducer from "../reducer/reducer"

let API = "https://hn.algolia.com/api/v1/search?";


const initialState = {
    isLoading: true,
    query: "",
    nbPages: 0,
    page: 0,
    hits: [],
};
const AppContext = React.createContext();

// to create provider function
const AppProvider = ({ children }) => {
    // const [state, setState]=useState(initialState)
    const [state, dispatch] = useReducer(reducer, initialState)

    const fetchApiData = async (url) => {
        dispatch({type:"SET_LOADING"})
        try {
            const res = await fetch(url)
            const data = await res.json()
            dispatch({
                type: "GET_STORIES",
                payload: {

                    hits: data.hits,
                    nbPages: data.nbPages,

                },
            });


        } catch (error) {
            console.log(error)
        }

    }
    const removePost=(post_ID)=>{
        dispatch({type:"REMOVE_POST",payload:post_ID});
    }

    const searchPost=(searchpost)=>{
        dispatch({type:"SEARCH_POST",payload:searchpost})
    }
    // pagination
    const getNextPage=()=>{
        dispatch({type:"NEXT_PAGE"})

    }


    const getPrevPage=()=>{
        dispatch({type:"PREV_PAGE"})

    }


    useEffect(() => {
        fetchApiData(`${API}query=${state.query}&page=${state.page}`)
    }, [state.query,state.page])

    return (
        <AppContext.Provider value={{...state,removePost,searchPost,getPrevPage,getNextPage}}>{children}

        </AppContext.Provider>
    )

}
// custom hook creation

const useGlobalContext = () => {
    return useContext(AppContext)
}

export { AppContext, AppProvider, useGlobalContext }



const AuthReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return { currentUser: action.payload };

        case "LOGOUT":
            sessionStorage.removeItem("accessToken");
            return { currentUser: null };

            case "UPDATE_ACCESS_TOKEN":
                return {
                    ...state,
                    currentUser: state.currentUser
                        ? { ...state.currentUser, accessToken: action.payload }
                        : { accessToken: action.payload }, // Pastikan ada currentUser
                };            

        default:
            return state;
    }
};

export default AuthReducer;
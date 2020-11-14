
//Не забывать обработать сценарий, когда ранее полей нет в стейте, ибо у окончательных пользователей сохраняется стейт при обновлении
const initialState = {

}

const persistSessionReducer = (persistSession = initialState, action) => {
    switch (action.type) {

        default:
            return persistSession;
    }
}

export default persistSessionReducer;
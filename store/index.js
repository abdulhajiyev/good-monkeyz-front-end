export const state = () => ({
    wallet: ''
})

export const getters = {
    getWallet(state) {
        return state.wallet;
      }
}

// actions - 
export const actions = {
}

// mutations -
export const mutations = {
    setWallet(state, wallet) {
        console.log('setWallet');
        state.wallet = wallet;
    }
}
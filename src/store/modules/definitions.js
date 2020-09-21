import axios from "axios";
export default {
  state: {
    isFetching: false,
    word: "",
    response: {},
  },
  getters: {
    getIsFetching: (state) => state.isFetching,
  },
  mutations: {
    SET_WORD(state, word) {
      state.word = word;
    },
    SET_RESPONSE(state, response) {
      state.response = response;
    },
    START_FETCH(state) {
      if (state.isFetching) return;
      state.isFetching = true;
    },
    STOP_FETCH(state) {
      if (!state.isFetching) return;
      state.isFetching = false;
    },
  },
  actions: {
    async getDefinition({ commit }, word) {
      commit("START_FETCH");
      // tracks the currently searched for word
      // const targetLanguage = "en";
      // const endpoint = `https://api.dictionaryapi.dev/api/v2/entries/${targetLanguage}/`;
      const endpoint = `https://api.datamuse.com/words?sp=${word.toLowerCase()}&md=d&max=1`;
      try {
        const results = await axios.get(endpoint);
        if (results.data.length > 0) {
          commit("STOP_FETCH");
        }
        // commit("SET_WORD", word);
        console.log(results.data);
      } catch (err) {
        commit("STOP_FETCH");
        console.log(err.response.status);
        console.log(err.response.data);
        throw new Error("Failed to reach the server");
      }
    },
  },
};

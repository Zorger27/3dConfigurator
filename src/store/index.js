import { createStore } from 'vuex'
import infoStore from "@/store/modules/service/infoStore";

export default createStore({
  modules: {
    infoStore,
  }
})

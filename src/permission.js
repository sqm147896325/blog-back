import router from './router'
import store from './store'

router.beforeEach(async (to,from,next) => {
	store.commit('setActiveMenu',to.path);
	next()
})
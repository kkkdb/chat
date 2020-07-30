import * as type from "./mutations-types.js"
export default {
	[type.FN]: (state, obj) => {
		console.log(obj)
	},
	[type.SETSTATE]: (state, obj) => {
		state[obj.key] = obj.value;
		uni.setStorageSync(obj.key, obj.value);
	},
	[type.GOBACK]: (state) => {
		uni.navigateBack({
			delta: 1
		})
	}
}

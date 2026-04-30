// https://vitepress.dev/guide/custom-theme
import { h, defineComponent, Fragment } from "vue";
import { useData } from "vitepress";
import Theme from 'vitepress/theme-without-fonts' // https://vitepress.dev/zh/guide/extending-default-theme#using-different-fonts
// 引入组件库的少量全局样式变量
import 'tdesign-vue-next/es/style/index.css';

import "./style.css";
import Comment from "./components/Comment.vue";
import ImageViewer from "./components/ImageViewer.vue"
import Subscribe from "./components/Subscribe.vue";
import FloatingOutline from "./components/FloatingOutline.vue";

export default {
	...Theme,
	Layout: defineComponent({
		setup(props, { slots }) {
			const { page } = useData();
			return () => h(Fragment, null, [
				h(Theme.Layout, null, {
					...slots,
					"doc-after": () => h(Comment),
					"doc-bottom": () => h(ImageViewer),
				}),
				h(FloatingOutline, { headers: page.value?.headers || [] }),
			]);
		},
	}),

	enhanceApp({ app }) {
		app.component("Comment", Comment);
	},
};


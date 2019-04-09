import './style.css';
import Vue from 'vue';
import app from './components/app.vue';

const main = new Vue({
	el: '#app',
	components: {app},
	template: '<app />'
});
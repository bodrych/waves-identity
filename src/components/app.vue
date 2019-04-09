<template>
	<div class="flex-col">
		<div>
			<span>1. Send code to E-mail which you want to verify</span>
			<input type="text" v-model="email.code" placeholder="Email">
			<input type="submit" class="submit button" @click="send" value="Send code">
			<span>{{ message.code }}</span>
		</div>
		<div>
			<span>2. Enter seed phrase for actions 3 and 4</span>
			<input type="text" v-model="seed" placeholder="Seed phrase">
		</div>
		<div>
			<span>3. Enter code from email to verify it</span>
			<input type="text" v-model="email.code" placeholder="Email">
			<input type="text" v-model="code" placeholder="Code">
			<input type="submit" class="submit button" @click="confirm" value="Confirm email">
			<span>{{ message.confirm }}</span>
		</div>
		<div>
			<span>4. Send tokens to email</span>
			<input type="text" v-model="email.transfer" placeholder="Email">
			<input type="text" v-model="assetId" placeholder="Asset ID">
			<input type="number" v-model="amount" placeholder="Amount">
			<input type="submit" class="submit button" @click="transfer" value="Transfer">
			<span>{{ message.transfer }}</span>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	import { invokeScript, broadcast } from '@waves/waves-transactions'

	export default {
		name: 'app',
		data: () => {
			return {
				url: 'https://bodrych.xyz',
				nodeUrl: 'https://testnodes.wavesnodes.com',
				address: '3MsRyMBXjemAkwkWGhfsrK6oJujK2QqEXhz',
				seed: '',
				email: {
					code: '',
					confirm: '',
					transfer: '',
				},
				message: {
					code: '',
					confirm: '',
					transfer: '',
				},
				assetId: '',
				amount: null,
				code: ''
			}
		},
		methods: {
			send: async function() {
				try {
					this.message.code = 'Wait ...'
					const response = await axios.get(this.url + '/send', {
						params: {
							to: this.email.code
						}
					})
					const data = response.data
					if (data.message == 'sent') this.message.code = 'Check inbox'
				} catch (e) {
					console.log(e)
				}
			},
			confirm: async function() {
				this.message.confirm = ''
				let params = {
					dappAddress: this.address,
					payment: [],
					call: {
						function: 'confirm',
						args: [
							{ type: 'string', value: this.email.code },
							{ type: 'string', value: this.code }
						]
					},
					chainId: 84
				}
				try {
					let tx = invokeScript(params, this.seed)
					let res = await broadcast(tx, this.nodeUrl)
					this.message.confirm = 'Transaction id: ' + tx.id
				} catch (err) {
					this.message.confirm = err.message
					console.log(err)
				}
			},
			transfer: async function() {
				this.message.transfer = ''
				let params = {
					dappAddress: this.address,
					payment: [{
						amount: this.amount,
						assetId: this.assetId
					}],
					call: {
						function: 'transfer',
						args: [
							{ type: 'string', value: this.email.transfer }
						]
					},
					chainId: 84
				}
				try {
					let tx = invokeScript(params, this.seed)
					let res = await broadcast(tx, this.nodeUrl)
					this.message.transfer = 'Transaction id: ' + tx.id
				} catch (err) {
					this.message.confirm = err.message
					console.log(err)
				}
			},
			checkKeeper: function() {
				return typeof window.Waves !== 'undefined';
			}
	}

}
</script>

<style>
</style>
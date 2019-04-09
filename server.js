const express = require('express')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const sha256 = require('js-sha256').sha256
const { data, broadcast } = require('@waves/waves-transactions')
const app = express()

const nodeUrl = 'https://testnodes.wavesnodes.com'

const seed = ''

const randomValueHex = (len) => {
  return crypto
    .randomBytes(Math.ceil(len / 2))
    .toString('hex')
    .slice(0, len)
}

const smtpTransport = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'wavesidentitymanager@gmail.com',
		pass: ''
	}
})

app.get('/', (req, res) => {
	res.sendFile('index.html', { root : __dirname});
})

app.get('/send', async (req, res) => {
	const code = randomValueHex(6)
	const codeHash = sha256(code)
	const base64String = Buffer.from(codeHash, 'hex').toString('base64')
	const host = req.get('host')
	mailOptions = {
		to : req.query.to,
		subject : 'Please confirm your email',
		html : 'Hello,<br>Your code: ' + code
	}
	smtpTransport.sendMail(mailOptions, (error, response) => {
		if(error){
			console.log(error)
			res.json({message: 'error'});
		}else{
			console.log("Message sent: " + response.message)
			res.json({message: 'sent'})
		}
	})

	const params = {
		data: [
			{ key: req.query.to + '#hash', type: 'binary', value: 'base64:' + base64String }
		],
		fee: 500000
	}

	const signedDataTx = data(params, seed)
	broadcast(signedDataTx, nodeUrl).then(resp => console.log('ok'))
})

app.listen(3000, () => {
	console.log("Express Started on Port 3000");
});
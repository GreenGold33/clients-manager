const express = require('express')
const router = express.Router()

const Client = require('../../models/Client')

router.get('/clients', (req,res) => {
  const { user } = req
  Client.find().then( clients => res.render('clients', { clients, user }) )
})

router.get('/client/new', (req,res) => {
  const { user } = req
  res.render('addClient', { user })
})

router.get('/client/:id', (req,res) => {
  const { user } = req
  const { id } = req.params
  Client.findById(id).then( client => res.render('clientProfile', { client, user }) )
})

router.post('/clients', (req,res) => {
  const { name, address } = req.body
  const client = new Client({ name, address })
  client.save()
    .then( () => {
      res.redirect('/admin/clients')
    })
})

module.exports = router
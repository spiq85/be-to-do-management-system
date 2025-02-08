var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const { stringify } = require('jade/lib/utils');

// Get All Users
router.get('/get-all', async function (_req, res) {
  const users = await prisma.user.findMany();
  if (users.length === 0 || users === null || users === undefined) {
    res.status(404).json('No Users Found');
  } else {
    res.send(users);
  }
});

// Get User by ID
router.get('/get-user/:id', async function (req, res) {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if (user === null || user === undefined) {
    res.json('user with id ${id} not found');
  } else {
    res.send(user);
  }
});

// Create User
router.post('/create', async function (req, res) {
  const { name, email, password } = req.body;
  name === ''
    ? res.status(400).json('Please fill name field')
    : email === ''
      ? res.status(400).json('Please fill email field')
      : password === ''
        ? res.status(400).json('Please fill password field')
        : async () => {
            if (name === '' || email === '' || password === '') {
              res.json('Please fill all fields');
            } else {
              const hashPassword = await bcrypt.hash(password, 10);
              const stringPassword = await stringify(hashPassword);
              const user = await prisma.user.create({
                data: {
                  username: name,
                  email,
                  password: stringPassword,
                },
              });
              res.send(user);
            }
          };
});

// Update User
router.put('/update/:id', async function (req, res) {
  const { id } = req.params;
  const { name, email, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  const stringPassword = await stringify(hashPassword);
  name === ''
    ? res.status(400).json('Please fill the name field')
    : email === ''
      ? res.status(400).json('Please fill the email field')
      : password === null
        ? res.status(400).json('Please fill the password field')
        : async () => {
            const user = await prisma.user.update({
              where: {
                id: parseInt(id),
              },
              data: {
                username: name,
                email,
                password: stringPassword,
              },
            });
            res.send(user);
          };
});
// Delete User
// Delete User
router.delete('/delete/:id', async function (req, res) {
  const { id } = req.params;
  const userExist = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!userExist) {
    res.status(404).json('User not found');
  } else {
    const user = await prisma.user.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.send(user);
  }
});
module.exports = router;

# Express Security And Roles

## Steps to reproduce to start

```sh
irongenerate --auth express-security-and-roles
cd express-security-and-roles
code .
```

Create `models/Room.js` 
```js
// models/Room.js
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const roomSchema = new Schema({
  name:  String,
  description:  String,
  isPublished: { 
    type: Boolean,
    default: false,
  },
  _owner: { // `_` is a convention for ObjectId
    type: Schema.Types.ObjectId, 
    ref: 'User'
  }
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
```

Change the navbar of `views/layout.hbs` 
```html
<!-- views/layout.hbs -->

<!-- ... -->

{{!-- TODO: Display "Login/Signup/My rooms" only if not connected --}}
{{!-- TODO: Display "Logout" only if connected --}}
<nav>
  <a href="/">Home</a>
  <a href="/auth/login">Login</a>
  <a href="/auth/signup">Signup</a>
  <a href="/auth/logout">Logout</a>
  <a href="/rooms">All rooms</a>
  <a href="/add-room">Add room</a>
  <a href="/my-rooms">My rooms</a>
</nav>
```

Create `views/rooms.hbs`
```hbs
<h1>All rooms</h1>

<ul>
{{#each rooms}}
  <li>{{this.name}}</li>
{{/each}}
</ul>
```

Create `views/add-room.hbs`
```hbs
<h1>Add room</h1>

<form action="/add-room" method="post">
  Name: <input type="text" name="name"><br>
  Description: <input type="text" name="description"><br>
  Is Published: 
  <select name="isPublished">
    <option value="true">Yes</option>
    <option value="false">No</option>
  </select>
  <br>
  <button type="submit">Create the room</button>
</form>
```

Update `routes/index.js`
```js
const express = require('express');
const router  = express.Router();
const Room = require('../models/Room')

router.get('/', (req, res, next) => {
  res.render('index');
});


router.get('/rooms', (req,res,next)=>{
  Room.find({ isPublished: true })
  .then(rooms => {
    res.render('rooms', {rooms})
  })
})

// TODO: make these routes only available if connected 
router.get('/add-room', (req,res,next)=>{
  res.render('add-room')
})
router.post('/add-room', (req,res,next)=>{
  Room.create({
    name: req.body.name,
    description: req.body.description,
    isPublished: req.body.isPublished,
  })
  .then(() => {
    res.redirect('/rooms')
  })
  .catch(next)
})
router.get('/my-rooms', (req,res,next)=>{
  Room.find() // TODO: change the filter to only show the right rooms
  .then(rooms => {
    res.render('rooms', {rooms})
  })
  .catch(next)
})

module.exports = router;

```


## Role

### Step 1
Create a field `role` in `models/User.js`

### Step 2
Create a middleware `checkAdmin` and protect the root with this middleware.

Or you can also create a middleware `checkRole`.

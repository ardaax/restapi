const express = require('express');
const app = express();
const port = 3000;
var bodyParser = require('body-parser');
const axios = require('axios').default;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));

 // Dummy List for users. Used for PUT and POST methods
let user_list = [
    {
    id: 1,
    name: 'Arda Andırın',
    username: 'ardaax',
    email: 'arda@april.biz',
    address: ["Object"],
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org',
    company: ["Object"]
  },
  {
    id: 2,
    name: 'Elon Musk',
    username: 'eloon',
    email: 'tesla@april.org',
    address: ["Object"],
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org',
    company: ["Object"]
  }
  
]; 
var posts_list = [
  {
  title: 'foo1',
  body: 'bar1',
  userId: 1
  }
];

function getPosts() {
  return axios.get('https://jsonplaceholder.typicode.com/posts');
}

function getComments() {
  return axios.get('https://jsonplaceholder.typicode.com/comments');
}


//Users Enpoints

// 1. Gets all the users -- DONE
app.get('/users', function (req, res, next) {
    axios.get('https://jsonplaceholder.typicode.com/users')
    .then(function (response) {
    // handle success
    console.log(response);
    res.json(response.data)
}).catch(function(error) {
  res.json("An error occured!");
})
})


// 2. Get spesific user -- DONE
app.get('/users/:id', (req, res, next) => {
    //res.send(req.params.id)
    var id = parseInt(req.params.id);
    if(!id) {
        res.json("There is no such user!")
    } else {
        axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)
          .then(function(response) {
            res.json(response.data)
          })
          .catch(function(error) {
            res.json("There is no user with that id")
          })
      }
    })
 

// 3. Update spesific user as an update username is given -- DONE
app.put('/users/update/:id', (req,res) => {
    const username = req.body.username
    if(!req.params.id) {
        res.json("There is no such user!")
    } else {
        axios.get(`https://jsonplaceholder.typicode.com/users/${req.params.id}`)
          .then(function(response) {
            data = response.data;
            data.username = username;
            console.log(data)
            console.log(username)
            res.json(data)

          }).catch(function(error) {
            res.json("An error occured!")
          })
      }
    })


// 4. Create a new user. // DONE
// You can see with curl -X POST http://localhost:3000/usersnew -d '{"name":"Arda", username="ardaax", id=11}'
// or in postman send data with x-www-form-urlencoded
app.post('/usersnew', (req, res) => {
  let name = req.body.name;
  let username = req.body.username;
  let id = req.body.id;
  console.log(req.body);
  /* If we were to post the data
  axios({
    method: 'post',
    url: `https://jsonplaceholder.typicode.com/users/${req.body.id}`,
    data: req.body
  });
  */
  user_list.push(req.body)
  console.log(user_list)
  res.json(user_list) 
})


//POSTS ENDPOINT

//1. Get all posts with comments Nested
app.get('/posts/comments', function (req, res) {
  axios.all([getPosts(), getComments() ])
    .then(axios.spread(function (posts, comments) {
      var p = posts.data;
      var c = comments.data;
      //console.log(c.length);
      let pid = 1;
      let comment_list = [] // This array is temporary and updated every time id is same as the old one.
      for (let index = 0; index < c.length; index++) {
        console.log("This is the pid ", pid);
        if(c[index].postId == pid) {
          comment_list.push(c[index]);  //Aggregate the comment
          p[pid-1]["comments"] = comment_list;  // Add it to to posts.
        }
        else {  // Pid changed
          pid = c[index].postId;  // Update pid
          comment_list = [] // Empty the list
          comment_list.push(c[index]);  //Aggregate the new comment
          p[pid-1]["comments"] = comment_list;  // Add it to to posts.
        }
      }
      res.json(p);
    })
    )
})


let newpost = {
  title: 'foo',
  body: 'bar',
  userId: 1
};

let mock_user = 
  {
    id: '0', // This will change
    name: 'New user',
    username: 'neww',
    email: 'new@april.biz',
    address: ["Object"],
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org',
    company: ["Object"]
  }


//2. Add new post -- DONE
// I check if there is a user with id in userlist.
// If not I create one in the user_list.
app.post('/posts/add', (req, res) => { 
  let result = user_list.filter(result => result.id == newpost.userId) 
  console.log("Result is " + result);
  if(!(Array.isArray(result) && result.length)) { // There is no such user first create one with mock data
    console.log("No such a user")
    mock_user.id = newpost.userId;  // Set the id of the mock data
    user_list.push(mock_user);  // Created user, now post the data
    posts_list.push(newpost);
  } 
  else {    // There is a user, just post the new post
    console.log("There is a user")
    posts_list.push(newpost);
  }
  console.log(user_list);
  res.json(posts_list);
})



//COMMENTS ENDPOINT
//1. get all comments of a post given id -- DONE
app.get('/comments/:id', function (req, res) {
  var id = req.params.id;
  axios.get(`https://jsonplaceholder.typicode.com/posts/${id}/comments`)
  .then(function (response) {
  // handle success
  console.log(response);
  res.json(response.data)
}).catch(function(error) {
  res.json("Error occured!")
})
})


//2. Get all comments of a user, given the email in the body --DONE
app.get('/commentsall', function (req, res) {
  let email = req.body.email;
  console.log(email)
  axios.get(`https://jsonplaceholder.typicode.com/comments`)
  .then(function (response) {
  // handle success
  let comments = response.data;
  let data = [];
  for (let index = 0; index < comments.length; index++) {
    if(comments[index].email == email) {
      //console.log("HIT");
      data.push(comments[index]);
    };
  }
  res.json(data);
}).catch(function(error) {
  res.json("Error occured!")
})
})
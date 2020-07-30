# REST API with express

As a fake json server https://jsonplaceholder.typicode.com/ is used.
 

## To start use the command
```bash
node index.js
```

## Available Routes

### Users
* `/users` -> Gets all the users
* `/users/:id` -> Given the id, gets the info of a spesific user.
* `/users/update/:id` -> Given the id and a "username" updates the username of that user with id.
* `/usersnew` -> Creates a new user. (Adds it to the local list but axios post is written and commented out.)

 
### Posts
* `/posts/comments` -> Gets all posts with comments
* `/posts/add` -> Adds a new post

### Comments
* `/comments/:id` -> Gets all comments of a post given the id of the post
* `/commentsall` -> Gets all comments of a user given the email in the request body.

## Notes
1. With **Postman** the routes can be tested.
2. For the routes that require a body, please select x-www-form-urlencıded to give data.


## Info

* It took 6 Hours 51 minutes and 2 seconds to finish.

## Todos
1. Learn async/await pattern and implement.
2. Local dummy database.
3. Learn more about ES6 features.


I learned more about nodejs and express and how the routes work, as well as a bit of axios.

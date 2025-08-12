---
applyTo: '**'
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.
Objective
Over the last two sprints, you built the front end for your “WTWR” project. The back-end projects will focus on creating a server for “WTWR”. While working on this, you'll learn how to work with databases, set up security and testing, and deploy your web application on a remote machine. The goal of all this is to create a server with an API and user authorization.

At this stage, you'll:

set up an Express project
create a database and connect it to the server
configure the first routes and controllers
handle errors
The project is broken down into 6 stages below. Let's get to it!

1. Set up the project
Clone the repository called se_project_express from your GitHub account to your computer. Enter the directory on your local machine and run npm init to generate the package.json file. Make sure you fill out the name and author fields.

Create a .gitignore file:

# Logs
logs
*.log
npm-debug.log*

# Dependency directory
node_modules

# Optional npm cache directory
.npm

# System files and IDE settings folders
.DS_Store
.idea
.vscode
We've also added the .editorconfig file to the repository. For the settings to take effect, you must install the EditorConfig extension in your code editor. In VS Code, it's called "EditorConfig for VS Code." Once the extension is installed, restart the editor. 

Install Express by running the following command:

npm install express@^4.21.2
Inside the starting repository, you’ll find a hidden directory called /.github. This directory contains configuration files for the testing script you’ll run before submitting your project. This will be explained in detail at the end of the project description.

2. Set up a linter
Linters are used to find errors and maintain code consistency. There are a variety of linters out there, but the one we're going to use is called ESLint. You can configure ESLint to your own style or even load ready-made configurations — presets based on ’style guides’. We'll stick to the Airbnb JavaScript Style Guide since it's the most widespread and will likely be used by your future employers.

Install the following three dev dependencies:

npm i eslint@8 eslint-config-airbnb-base@15 eslint-plugin-import@2 --save-dev
💡 Note that we have specifically installed ESLint version 8 and chosen specific major versions for the other packages. ESLint version 9 was recently released but introduces breaking changes.

Now create a file called .eslintrc.js in the root of your project, with the following contents.

module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: "airbnb-base",
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {},
};
Integrate Prettier
If you are using Prettier to format your code, you may immediately notice that Prettier and the Airbnb style guide disagree on quotation marks. The easiest solution to this is to install the appropriate packages:

npm install eslint-config-prettier@8 prettier@2 --save-dev
Then update your config file to include the eslint:recommended and prettier extensions.

module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  
  // Add the necessary extensions.
  extends: ["eslint:recommended", "airbnb-base", "prettier"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
  },
};
Add an exception
According to Airbnb's JavaScript Style Guide, underscores shouldn't be used for identifier names in JS, so ESLint will identify the _id variable in the project files as an error.

Let's change this rule. In the .eslintrc.js file, add an exception for _id. We'll leave some links on how to do this below, but before clicking on them, see if you can figure it out yourself. Being a programmer is about problem-solving, so consider this a mini-task.

Instructions on configuring rules for ESLint can be found here.

Instructions on configuring the rule for underscores in identifiers can be found here.

Note that you should add the rules to the .eslintrc.js file. We strongly recommend avoiding adding rules directly to the code. The rules should work for the whole project simultaneously, not for individual lines of code.

Add a script to run the linter
Add a lint command to the scripts section in your project's package.json, like this:

"scripts": {
  // other scripts
  "lint": "npx eslint ." 
}
Now you'll be able to run the linter from the command line by typing npm run lint. Make sure to run it before you send your project for review. No linter errors and warnings should appear in the console.

To automatically fix the formatting errors with ESLint, run the following command:

npm run lint -- --fix
Note that you must add the two dashes before passing along the --fix flag in order to tell the console that you are starting an npm script from within another npm script.

3. Create an entry point
In the project root, create the app.js file. This will be our entry point. Create an Express server inside of it and configure it to run on port 3001 with the following command:

npm run start
To set another port number for an Express.js app, use the following line in the entry point file:

const { PORT = 3001 } = process.env;
4. Set up hot reload
Make the server restart when project files change. To do this, install the nodemon package as a dev dependency:

npm install nodemon --save-dev
The application should be launched with a hot reload when running the command:

npm run dev
Configure the dev script in package.json.

5. Create the project structure
We could write all the code in app.js, but that wouldn't be very convenient. We'll structure the project in a way that makes it clear what each file does.

Create folders for modules:

routes for storing files responsible for request routing
controllers for storing files with functions that define routes
models for storing files with described schemas and models
utils for storing supportive data
The initial project structure should look something like this:

A screenshot of the initial project structure, consisting of the folders for controllers, models routes, and utils, as well as a few other project files.

6. Create a database
Next, you need to initialize a database for storing user and clothing item data. Make sure you have MongoDB installed on your computer.

Install Mongoose to your project:

npm install mongoose@^8.9.5
Connect to the database
In app.js, connect to the MongoDB server:

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');
In the example above, wtwr_db is the name of the database you connect to. However, you can choose your own database name, if you prefer.

💡 Note: In mongoose connection strings, you will sometimes see localhost used instead of 127.0.0.1. This works on some systems, but on certain computers, and with some versions of Node.js and MongoDB, this will cause errors. For this reason, it’s preferable to use 127.0.0.1 in your mongoose connection streams.

Create schemas and models
You have two resources in your project: a user and a clothing item. Create a schema and a model for each.

User schema fields:

name — the name of the user, a required string from 2 to 30 characters
avatar — a required string for the URL of the user's image
Clothing item schema fields:

name — the name of the clothing item, a required string from 2 to 30 characters
weather — a required string that describes the weather type. Make sure it matches the weather type you defined in your React app ('hot', 'warm', and'cold'). Use the enum validator to implement the field.
imageUrl — the picture of the clothing item, a required string for the image URL
owner — a link to the item author's model of the ObjectId type, a required field
likes — a list of users who liked the item, an ObjectId array with a reference to the user modal (empty by default)
createdAt — the item creation date, a field with the Date type and the default value Date.now
Validate URLs
For the avatar field in the user schema and imageUrl in the clothingItem schema, you'll need to validate that users paste a valid string URL. To do this, install the validator package to your project and define a custom validator for the fields:

validate: {
  validator(value) {
    return validator.isURL(value);
  },
  message: 'You must enter a valid URL',
}
7. Create routes and controllers
⚠️ Now would be a good time to get the Postman test suite up and running, to help you test your routes as you implement them.

While working on the project previously, you accessed the third-party API or the mock one. Now, you'll create an API for the “WTWR” app yourself, starting right now. Let's implement the routes and controllers.

Users
Implement three routes:

GET /users — returns all users
GET /users/:userId - returns a user by _id
POST /users — creates a new user
Create three corresponding controllers: getUsers, getUser, and createUser.

In the body of the POST request for creating a user, pass a JSON object with two fields: name and avatar.

Clothing items
Implement the following three routes:

GET /items — returns all clothing items
POST /items — creates a new item
DELETE /items/:itemId — deletes an item by _id
In the body of the POST request for creating a card, a user should be able to send an item name, weather type, and image URL. They will be passed to the server as a JSON object. You will also need a user ID for the owner field. Move on to the next step to add a user object to each request.

Non-existent resources
Handle cases when the client request is sent to a non-existent resource. You can do it by checking the result status code inside router.use(). If the resource doesn't exist, the server should respond with the following message:

{
  "message": "Requested resource not found"
}
8. Implement a temporary authorization solution
Create a test user
Create a test user via Postman:

A screenshot of a new Test User object created using Postman.

After you’ve run the request to create a new user in Postman, open Compass. Databases and collections are created by mongoose when you add data to them, so if the request to add a user was successful there should now be a database called wtwr_db. A collection of users with the user you just created should appear in the database.

Copy the test user's _id. You'll need it in the next step.

Create an authorization middleware
The clothing item has an owner field to store information about its owner. However, in the request, the client doesn't currently send any user information. Later, you'll fix this, but for now, you'll implement a temporary workaround.

In the app.js file, create the following middleware:

app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133'// paste the _id of the test user created in the previous step
  };
  next();
});
This middleware adds a user object to each request. Take the user ID from it inside the card creation controller:

module.exports.createClothingItem = (req, res) => {
  console.log(req.user._id);// _id will become accessible
};
This is only a temporary solution. We've hardcoded the user ID, so the item will have the same author in the database regardless of who actually created it. That's okay for now, and we'll fix it in the next sprint.

9. Handle errors
If something goes wrong with the request, you'll need to return an appropriate message, along with the corresponding error code:

400 — invalid data passed to the methods for creating an item/user or updating an item, or invalid ID passed to the params.
404 — there is no user or clothing item with the requested id, or the request was sent to a non-existent address.
500 — default error. Accompanied by the message: "An error has occurred on the server."
For convenience, keep the variables storing the error codes in a separate utils/errors.js file. This will be helpful because their list will expand in the future. Export the variables and use them in the code when configuring error handling.

When catching an error, check the name of the error using console.log(err.name) to determine what status and message to send back. Each request should have a JSON response with a message field. You can do this like so:

const { SOME_ERROR_CODE } = require("../utils/errors");

const createUser = (req, res) => {
  User.create(...)    // arguments omitted
    .then(...)        // handle successful request
    .catch((err) => {
      console.error(err);
      if (err.name === 'SomeErrorName') {
        return res.status(SOME_ERROR_CODE).send({ message: "Appropriate error message" })
      } else {
        // if no errors match, return a response with status code 500
      }
    });
}
Some points to keep in mind about the preceding code block:

At the top of the catch block, we're logging the errors to the terminal with console.error(). This is critical: without logging, we are obscuring information that is necessary in order to handle the errors. The terminal is the first place you should check whenever your code isn't behaving the way you think it should.
In many cases, one or more else if branches may be necessary to handle all potential errors.
We have included a catch-all else branch that handles errors not otherwise caught.
Each of your requests should have a catch block similar to the one shown above.

Use the orFail() helper
When attempting to find a record with Mongoose, such as with findOne or findById, if the record is not found, your app should not throw an error. Instead, it should simply pass null into your .then handler.

ClothingItem.findById(id) // some non-existent ID
  .then((item) => {
    // incorrectly sends `null` back to the client with a 200 status!
    res.send(item);
  })
  .catch((error) => {
    console.error(`Error ${err.name} with the message ${err.message} has occurred while executing the code`);
    // does not run because no error was thrown
  });
You could handle this by checking if (item == null) in your .then and throwing an error there. But your code will be smoother if the orFail helper is run when no record is found:

ClothingItem.findById(id)
  .orFail() // throws a DocumentNotFoundError
  .then((item) => {
    res.send(item); // skipped, because an error was thrown
  })
  .catch((error) => {
    console.error(`Error ${err.name} with the message ${err.message} has occurred while executing the code`);
    // now this does run, so we can handle the error and return an appropriate message
  });
You can also pass in a custom function to the orFail method:

.orFail(() => {
  const error = new Error("Item ID not found");
  error.statusCode = 404;
  throw error; // Remember to throw an error so .catch handles it instead of .then
})
10. Create routes and controllers for likes
Implement two more routes:

PUT /items/:itemId/likes — like an item
DELETE /items/:itemId/likes — unlike an item
Each route will need the _id of the user who is performing the action. Get it from req.user._id.

A user should only be able to like a given card once. Therefore, the array of likes must consist of unique values. To do this, only add a user when they aren't already present inside of the array. In Mongo, this logic is implemented using special operators:

$addToSet — to add an item to the array if it's not there yet
$pull — to remove an item from the array
module.exports.likeItem = (req, res) => ClothingItem.findByIdAndUpdate(
  req.params.itemId,
  { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
  { new: true },
)
//...

module.exports.dislikeItem = (req, res) => ClothingItem.findByIdAndUpdate(
  req.params.itemId,
  { $pull: { likes: req.user._id } }, // remove _id from the array
  { new: true },
)
//...
Notice that we are passing the {new: true} option to the method. We need to set it to return the document after update was applied. If we didn't, the update methods would return a pre-update result in the service response, giving the impression that the methods are not working. 

11. Test your project
Your previous projects were pre-checked automatically by automated tests. For this project, you'll check your projects independently using two new tools: Postman and GitHub Actions. You'll likely use both tools a lot as a software engineer.

Postman
Make sure you have a Postman account and follow the link below:

🔗 Postman Test Suite

Then fork the collection to your account:

💡 An important note regarding Postman collection

Recently, Postman began limiting the number of monthly collection runs to 25. This change impacts the number of times you can run the test suites for Projects 12 and 13. Note that this limit only applies to running the entire test suite; running individual tests from the collection doesn’t count toward this limit. Please plan your workflow accordingly.

Make sure you have a Postman account and follow link. Fork the collection to your account:

image

Label the fork and save it to your workspace:

The Postman screen showing the fork.

In the fork, click the "Run" button. You'll see the list of responses for testing:

The Postman screen showing a list of responses from the fork.

After running the requests, you'll get a report with the results:

The Postman screen showing the results from running the forked collection of requests.

Note that the requests with valid IDs use the collection variables validCardId and validUserId. By default, they use the first array element, so if the structure of your elements doesn't match the tests, it can cause an error. In this case, replace the Postman variables with real IDs from your database.

Make sure all the requests run successfully. You can check every failed request individually by clicking on it.

GitHub Actions
Before you submit your work for review, you need to make sure that the code successfully passes the tests in GitHub Actions.

Test scripts and the result of their execution are available in the Actions tab in the Workflow panel. The left column (Workflows) contains a list of validation scripts, and the right column contains their execution history.

The GitHub Actions screen. The Actions panel is highlighted along with the Works panel and the Workflow runs.

If the code successfully passes the tests, a green circle with a checkmark appears next to the last commit:

The GitHub Actions success screen.

If you see a red circle with an x, it means that some of the tests were executed with an error. To find out the reason for the test failure, click on the corresponding commit and then on the failed test:

The GitHub Actions fail screen.

If some tests fail, we recommend carefully rereading the requirements and checking the project against the checklist. When there are no failed tests remaining, you can submit your work for review.

If the tests fail, but you are firmly convinced that there are no errors in your solution, you can submit the project for review as an exception. In this case, you should inform the learning coach about the problem and attach a link to the repository, indicate the name of the failed test, and your assumptions about why this happened. For example, let us know if you used a non-standard, but correct approach or a new syntax. This will help us improve the tests.

Updating the test suites
The Postman and GitHub Actions test suites are a work in progress, so we may occasionally ask you to update them. To update the Postman tests, you just need click the menu icon for the test suite, click Pull changes, and then authorize the action on the following page.  

The Postman test suite menu, with the Pull changes button emphasized.

If we ask you to update the GitHub Actions tests, we’ll provide you with new .yml files. Simply replace the .yml files inside your project’s .github/workflows directory with the new files.

Checklist
Before submitting your project for review, be sure to verify your work according to the checklist:

Project 12 Criteria

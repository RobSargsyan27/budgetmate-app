# BudgetMate

---

# Preface

Course Name: Programming 5

Full Name: Robert Sargsyan 

Student Id: 0165766-90

Email: robert.sargsyan@student.kdg.be

---

# Objective

BudgetMate is a web application which will help you to manage your finances and your family members expenses. BudgetMate provides a functionality to create multiple accounts, budgets and add different type of records such as expenses, incomes, and transfers between accounts. 

You can share your accounts with other users. Even though your balance will always be visible, you won’t have access to other users expense, income records. We provide an extensive search options for your records’ history as well extensive analytics for each month. This will help you to summarize monthly earnings and expenses.

---

# Application Stack

The application is divided into two main service [budgetmate-v2-api](https://gitlab.com/kdg-ti/programming-5/projects-24-25/acs202/robert.sargsyan/spring-backend) and [budgetmate-v2-app](https://gitlab.com/kdg-ti/programming-5/projects-24-25/acs202/robert.sargsyan/Client). 

The API service contains Rest APIs. The APIs are completely stateless, meaning that it uses JWT token to authenticate users. You can find quickly check the APIs markdown file here or open a documentation using this [link](http://localhost:80/swagger-ui/index.html). (Please note that the application should be run in order to open OpenAPI documentation). Our persistence layer which uses PostgreSQL follows all ACID principles.

The APP service contains the codebase for the application’s frontend. We currently use plain JS, CSS and HTML to support user interaction and the user interface in general but in the future we will migrate to React framework. 

The demo user account’s credentials are:

`email: user@budgetmate.com
password: user123`

---

# What BudgetMate does ?

There are 5 main sections in BudgetMate web application. All together support a complete functionality to manage your finances and expenses. 

The main page is `Dashboard` where you can quickly add new account, budget or record, as well as see all active accounts, and overview your monthly expenses, earnings, annual earning and overall outlook bar. Additionally, below you will find the analytics about last month’s expenses. On the top nav bar you can check you notifications and see current session’s history. 

In order to add an existing account of another user you need to provide the account’s name and another user’s username. Once the account’s owner accepts your request you will get an access to the account.

On the `Records History`  page you can search for your recents records, use advanced filtering and generate a report. If you click on one of the records you will be redirected to the record’s page where you can update or delete the record.

On the `Budgets`  page you can see you budgets, their current state and generate report for all your budgets.  If you click on one of the budgets you will be redirected to the budget’s page where you can update or delete the budget.

On the `Analytics`  page you can see the analytics for different months.

On the `Profile`  page you can update or delete your profile. 

---

# Week 1

## Domain Entities

The domain consists of the following entities:

- Account
- AccountAdditionRequest
- Budget
- EmailAuthToken
- Record
- RecordCategory
- User

## Get Started

In order to locally run the application you need to follow these steps:

1. Create a folder and name it `budgetmate` .
2. Clone [budgetmate-v2-api](https://gitlab.com/kdg-ti/programming-5/projects-24-25/acs202/robert.sargsyan/spring-backend)  or simply unzip the provided zip folder in `budgetmate` folder.
3. Clone [budgetmate-v2-app](https://gitlab.com/kdg-ti/programming-5/projects-24-25/acs202/robert.sargsyan/Client)  or simply unzip the provided zip folder in `budgetmate` folder.
4. Download [docker-compose.yaml](https://gitlab.com/kdg-ti/programming-5/projects-24-25/acs202/robert.sargsyan/spring-backend/-/blob/main/docker-compose.yaml?ref_type=heads) file and put it in `budgetmate` folder.
5. Run docker-compose.yaml file using `docker compose up -d`  command from the `budgetmate`  folder.
6. Add the below lines to you `/etc/hosts`  file.

```
127.0.0.1	app.budgetmate.com
127.0.0.1 budgetmate.com   www.budgetmate.com
```

Once you have these steps done you will have access to the [landing](http://localhost) web-page. Have a look on the landing web-page before logging into main application, it looks quite nice 😄

You access the main application through `login` button on the top navbar of the landing page or by following this [link](http://app.budgetmate.com/). There are credentials for the demo user’s account but you can try to register your own user account by following  `get started`  button on the top navbar. You need to provide your credentials after which we will send you an email to confirm that this is you and then you can log into your profile. **If you encounter an error during the registration step, it may be because the email vendor’s token has expired. Please contact me, and I will provide instructions for generating a new token.** 

---

# Week 2 & 3

## Available Endpoints (See More in [OpenAPI](http://localhost:80/swagger-ui/index.html))

### Account Addition Requests Endpoints

```
### Add user account request.
# Expected response status => HTTP/1.1 201
# Expected response content type => Content-Type: application/json
# Expected response body => {{ "id", "ownerUsername", "requestedUsername", "accountName" }}
POST http://localhost:8089/api/v1/account-requests HTTP/1.1
Accept: application/json
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "accountName": "General Account",
  "ownerUsername": "user1@budgetmate.com"
}

### Update user account request.
# Expected response status => HTTP/1.1 200
# Expected response content type => Content-Type: application/json
# Expected response body => {{ "id", "ownerUsername", "requestedUsername", "accountName" }}
PATCH http://localhost:8089/api/v1/account-requests/{{id}} HTTP/1.1
Accept: application/json
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "status": true
}

```

### Accounts Endpoints

```
### Get user accounts.
# Expected response status => HTTP/1.1 200
# Expected response content type => Content-Type: application/json
# Expected response body => {Array<{"id", "name", "currency", "currentBalance", "type", "avatarColor"}>}
GET http://localhost:8089/api/v2/accounts HTTP/1.1
Accept: application/json;
Authorization: Bearer {{token}}

### Add user account.
# Expected response status => HTTP/1.1 201
# Expected response content type => Content-Type: application/json
# Expected response body => {{"id", "name", "currency", "currentBalance", "type", "avatarColor"}}
POST http://localhost:8089/api/v2/accounts HTTP/1.1
Accept: application/json;
Content-Type: application/json;charset=UTF-8
Authorization: Bearer {{token}}

{
  "name": "Account-Test",
  "currency": "USD",
  "currentBalance": 27070,
  "type": "CASH"
}

### Get user accout.
# Expected response status => HTTP/1.1 200
# Expected response content type => Content-Type: application/json
# Expected response body => {{"id", "name", "currency", "currentBalance", "type", "avatarColor"}}
GET http://localhost:8089/api/v2/accounts/{{id}} HTTP/1.1
Accept: application/json
Authorization: Bearer {{token}}

### Update user account.
# Expected response status => HTTP/1.1 200
# Expected response content type => Content-Type: application/json
# Expected response body => {{"id", "name", "currency", "currentBalance", "type", "avatarColor"}}
PATCH http://localhost:8089/api/v2/accounts/{{id}} HTTP/1.1
Accept: application/json
Content-Type: application/json;charset=UTF-8
Authorization: Bearer {{token}}

{
  "type": "CREDIT_CARD",
  "currentBalance": 27000
}

### Delete user account.
# Expected response status => HTTP/1.1 204
# Expected response content type => Content-Type: application/json
# Expected response body => Empty
DELETE http://localhost:8089/api/v2/accounts/{{id}} HTTP/1.1
Accept: application/json
Authorization: Bearer {{token}}

```

### Analytics Endpoints

```
### Get user dashboard analytics.
# Expected response status => HTTP/1.1 200
# Expected response content type => Content-Type: application/json
# Expected response body => {{"monthlyEarnings", "annualEarnings", "monthlyExpenses"}}
GET http://localhost:8089/api/v2/analytics/dashboard HTTP/1.1
Accept: application/json
Authorization: Bearer {{token}}

### Get user dashbaord category pie chart.
# Expected response status => HTTP/1.1 200
# Expected response content type => Content-Type: application/json
# Expected response body => {{"labels", "data"}}
GET http://localhost:8089/api/v2/analytics/dashboard/categories-pie HTTP/1.1
Accept: application/json
Authorization: Bearer {{token}}

### Get user dashboard expenses line chart.
# Expected response status => HTTP/1.1 200
# Expected response content type => Content-Type: application/json
# Expected response body => {{"labels", "data"}}
GET http://localhost:8089/api/v2/analytics/dashboard/expenses-line-chart HTTP/1.1
Accept: application/json
Authorization: Bearer {{token}}

### Get user records overview.
# Expected response status => HTTP/1.1 200
# Expected response content type => Content-Type: application/json
# Expected response body => {{"monthlyEarnings", "annualEarnings", "monthlyExpenses"}}
GET http://localhost:8089/api/v2/analytics/overview?startDate={{startDate}}&endDate={{endDate}} HTTP/1.1
Accept: application/json
Authorization: Bearer {{token}}

### Get user records overview line chart.
# Expected response status => HTTP/1.1 200
# Expected response content type => Content-Type: application/json
# Expected response body => {{"labels", "data"}}
GET http://localhost:8089/api/v2/analytics/overview-line?startDate={{startDate}}&endDate={{endDate}}&recordType={{recordType}} HTTP/1.1
Accept: application/json
Authorization: Bearer {{token}}
```

### Authentication Endpoints

```
### Register user.
# Expected response status => HTTP/1.1 204
# Expected response content type => Content-Type: application/json
# Expected response body => Empty
POST http://localhost:8089/api/v2/auth/register HTTP/1.1
Accept: application/json
Content-Type: application/json

{
  "firstname": "John",
  "lastname": "Doe",
  "email": "user1@budgetmate.com",
  "password": "user123",
  "receiveNewsLetters": false
}

### Confirm user registraton.
# Expected response status => HTTP/1.1 204
# Expected response content type => Content-Type: application/json
# Expected response body => Empty
POST http://localhost:8089/api/v2/auth/register/confirm?email={{email}}&token={{token}} HTTP/1.1
Accept: application/json
Content-Type: application/json

### Login user.
# Expected response status => HTTP/1.1 201
# Expected response content type => Content-Type: application/json
# Expected response body => {{ "token" }}
POST http://localhost:8089/api/v2/auth/login HTTP/1.1
Accept: application/json
Content-Type: application/json

{
  "email": "user@budgetmate.com",
  "password": "user123"
}

### Validate user token.
# Expected response status => HTTP/1.1 201
# Expected response content type => Content-Type: application/json
# Expected response body => {{ "isTokenValid" }}
POST http://localhost:8089/api/v2/auth/validate-token HTTP/1.1
Accept: application/json
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyQGJ1ZGdldG1hdGUuY29tIiwiaWF0IjoxNzU1NTI0MzU3LCJleHAiOjE3NTU1MzUxNTd9.kFdfyAASog3ytr9rGPLXkV6g_3CfE0XXT2gHLqx92Xg"
}
```

### Budgets Endpoints

```
### Get user budgets.
# Expected response status => HTTP/1.1 200
# Expected response content type => Content-Type: application/json
# Expected response body => {Array<{"id", "name", "amount", "userId", "recordCategories"}>}
GET http://localhost:8089/api/v2/budgets HTTP/1.1
Accept: application/json
Authorization: Bearer {{token}}

### Add user budget.
# Expected response status => HTTP/1.1 201
# Expected response content type => Content-Type: application/json
# Expected response body => {{"id", "name", "amount", "userId", "recordCategories"}}
POST http://localhost:8089/api/v2/budgets HTTP/1.1
Accept: application/json
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "name": "Budget-Test",
  "amount": 17000,
  "recordCategories": ["Rent", "Insurance"]
}

### Get user budgets current balance.
# Expected response status => HTTP/1.1 200
# Expected response content type => Content-Type: application/json
# Expected response body => {Array<{"id", "currentBalance"}>}
GET http://localhost:8089/api/v2/budgets/current-balance HTTP/1.1
Accept: application/json
Authorization: Bearer {{token}}

### Get user budgets report.
# Expected response status => HTTP/1.1 200
# Expected response content type => Content-Type: application/json
# Expected response content disposition => Content-Disposition: attachment; filename=budgets-report.json
# Expected response body => {Array<{"id", "name", "amount", "userId", "recordCategories"}>}
GET http://localhost:8089/api/v2/budgets/report HTTP/1.1
Accept: application/json
Authorization: Bearer {{token}}

### Get user budget.
# Expected response status => HTTP/1.1 200
# Expected response content type => Content-Type: application/json
# Expected response body => {{"id", "name", "amount", "userId", "recordCategories"}}
GET http://localhost:8089/api/v2/budgets/{{id}} HTTP/1.1
Accept: application/json
Authorization: Bearer {{token}}

### Update user budget.
# Expected response status => HTTP/1.1 200
# Expected response content type => Content-Type: application/json
# Expected response body => {{"id", "name", "amount", "userId", "recordCategories"}}
PATCH http://localhost:8089/api/v2/budgets/{{id}} HTTP/1.1
Accept: application/json
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "name": "Budget-Test-2",
  "amount": 17500,
  "recordCategories": ["Grocery"]
}

### Delete user budget.
# Expected response status => HTTP/1.1 204
# Expected response content type => Content-Type: application/json
# Expected response body => Empty
DELETE http://localhost:8089/api/v2/budgets/{{id}} HTTP/1.1
Accept: application/json
Authorization: Bearer {{token}}
```

### Record Categories Endpoints

```
### Get record categories.
# Expected response status => HTTP/1.1 200
# Expected response content type => Content-Type: application/json
# Expected response body => {Array<{"id", "name", "description"}>}
GET http://localhost:8089/api/v1/record-categories HTTP/1.1
Accept: application/json
Authorization: Bearer {{token}}
```

### Records Endpoints

```
### Search user records.
# Expected response status => HTTP/1.1 200
# Expected response content type => Content-Type: application/json
# Expected response body => {Array<{"id", "amount", "userId", "category", "type", "note", "currency", "paymentTime", "withdrawalAccountName", "withdrawalAccountId", "receivingAccountName", "receivingAccountId"}>}
POST http://localhost:8089/api/v2/records/search HTTP/1.1
Accept: application/json
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "recordType": "EXPENSE",
  "amountGreaterThan": 100,
  "amountLessThan": 50000,
  "paymentTimeLessThan": "2025-08-01T00:00:00.000Z",
  "paymentTimeGreaterThan": "2024-08-01T00:00:00.000Z",
  "limit": 100,
  "offset": 0
}

### Count user records.
# Expected response status => HTTP/1.1 200
# Expected response content type => Content-Type: application/json
# Expected response body => {Number}
POST http://localhost:8089/api/v2/records/count HTTP/1.1
Accept: application/json
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "recordType": "INCOME",
  "amountGreaterThan": 100,
  "amountLessThan": 50000,
  "paymentTimeLessThan": "2025-08-01T00:00:00.000Z",
  "paymentTimeGreaterThan": "2024-08-01T00:00:00.000Z"
}

### Get user records.
# Expected response status => HTTP/1.1 200
# Expected response content type => Content-Type: application/json
# Expected response body => {Array<{"id", "amount", "userId", "category", "type", "note", "currency", "paymentTime", "withdrawalAccountName", "withdrawalAccountId", "receivingAccountName", "receivingAccountId"}>}
GET http://localhost:8089/api/v2/records HTTP/1.1
Accept: application/json
Authorization: Bearer {{token}}

### Add user record.
# Expected response status => HTTP/1.1 201
# Expected response content type => Content-Type: application/json
# Expected response body => {{"id", "amount", "userId", "category", "type", "note", "currency", "paymentTime", "withdrawalAccountName", "withdrawalAccountId", "receivingAccountName", "receivingAccountId"}}
POST http://localhost:8089/api/v2/records HTTP/1.1
Accept: application/json
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "amount": 5000,
  "paymentTime": "2025-07-02T00:00:00.000Z",
  "category": "Rent",
  "type": "EXPENSE",
  "note": "August home rent.",
  "withdrawalAccountId": "d4b4e407-63f5-7646-efe7-548f0ef37a48"
}

### Get user records report.
# Expected response status => HTTP/1.1 200
# Expected response content type => Content-Type: application/json
# Expected response content disposition => Content-Disposition: attachment; filename=records-report.json
# Expected response body => {Array<{"id", "amount", "userId", "category", "type", "note", "currency", "paymentTime", "withdrawalAccountName", "withdrawalAccountId", "receivingAccountName", "receivingAccountId"}>}
POST http://localhost:8089/api/v2/records/report HTTP/1.1
Accept: application/json
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "recordType": "INCOME",
  "amountGreaterThan": 100,
  "amountLessThan": 50000,
  "paymentTimeLessThan": "2025-08-01T00:00:00.000Z",
  "paymentTimeGreaterThan": "2024-08-01T00:00:00.000Z"
}

### Get user record.
# Expected response status => HTTP/1.1 200
# Expected response content type => Content-Type: application/json
# Expected response body => {{"id", "amount", "userId", "category", "type", "note", "currency", "paymentTime", "withdrawalAccountName", "withdrawalAccountId", "receivingAccountName", "receivingAccountId"}}
GET http://localhost:8089/api/v2/records/{{id}} HTTP/1.1
Accept: application/json
Authorization: Bearer {{token}}

### Update user record.
# Expected response status => HTTP/1.1 200
# Expected response content type => Content-Type: application/json
# Expected response body => {{"id", "amount", "userId", "category", "type", "note", "currency", "paymentTime", "withdrawalAccountName", "withdrawalAccountId", "receivingAccountName", "receivingAccountId"}}
PATCH http://localhost:8089/api/v2/records/{{id}} HTTP/1.1
Accept: application/json
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "paymentTime": "2025-07-27T00:00:00.000Z",
  "category": "Investment",
  "note": "August investments."
}

### Delete user record.
# Expected response status => HTTP/1.1 204
# Expected response content type => Content-Type: application/json
# Expected response body => Empty
DELETE http://localhost:8089/api/v2/records/{{id}} HTTP/1.1
Accept: application/json
Authorization: Bearer {{token}}
```

### Users Endpoints

```
### Get user.
# Expected response status => HTTP/1.1 200
# Expected response content type => Content-Type: application/json
# Expected response body => {{"id", "username", "firstname", "lastname", "country", "city", "address", "postalCode", "avatarColor", "role"}}
GET http://localhost:8089/api/v2/users HTTP/1.1
Accept: application/json
Authorization: Bearer {{token}}

### Update user.
# Expected response status => HTTP/1.1 200
# Expected response content type => Content-Type: application/json
# Expected response body => {{"id", "username", "firstname", "lastname", "country", "city", "address", "postalCode", "avatarColor", "role"}}
PATCH http://localhost:8089/api/v2/users HTTP/1.1
Accept: application/json
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "firstname": "T-firstname",
  "lastname": "T-lastname",
  "country": "USA",
  "city": "Los Angeles"
}

### Delete user.
# Expected response status => HTTP/1.1 204
# Expected response content type => Content-Type: application/json
# Expected response body => Empty
DELETE http://localhost:8089/api/v2/users HTTP/1.1
Accept: application/json
Authorization: Bearer {{token}}

### Get user notifications.
# Expected response status => HTTP/1.1 200
# Expected response content type => Content-Type: application/json
# Expected response body => {Array<{ "id", "ownerUsername", "requestedUsername", "accountName" }>}
GET http://localhost:8089/api/v2/users/notifications HTTP/1.1
Accept: application/json
Authorization: Bearer {{token}}
```

---

## Week 12

![Screenshot 1](./doc/img/week12-1.png)

In the above picture the sidebar nav items icons are bootstrap icons, except for one which is a `fortawesome` icon. (See more [here](https://gitlab.com/kdg-ti/programming-5/projects-24-25/acs202/robert.sargsyan/Client/-/blob/main/src/assets/js/index.js?ref_type=heads))

![Screenshot 2](./doc/img/week12-2.png)

The `joi` validation is used validate the above form for updating user details on profile page. The [link](https://gitlab.com/kdg-ti/programming-5/projects-24-25/acs202/robert.sargsyan/Client/-/blob/main/src/assets/js/lib/validation.lib.js?ref_type=heads) to the `validation.lib.js` and the [link](https://gitlab.com/kdg-ti/programming-5/projects-24-25/acs202/robert.sargsyan/Client/-/blob/main/src/assets/js/components/profile.js?ref_type=heads) to implementation. 

![Screenshot 3](./doc/img/week12-3.png)

There are two additional dependencies that are added one of which is the `jquery` and another is the `chart.js` . The `jquery` is used to support the sidebar dynamic functionality (see more [here](https://gitlab.com/kdg-ti/programming-5/projects-24-25/acs202/robert.sargsyan/Client/-/blob/main/src/assets/js/components/generic.js?ref_type=heads)) and the `chart.js`  is used to support charts in the website (See more [here](https://gitlab.com/kdg-ti/programming-5/projects-24-25/acs202/robert.sargsyan/Client/-/tree/main/src/assets/js/charts?ref_type=heads)) 

---

## Project Requirements

| Week | Requirement | Status |
| --- | --- | --- |
| 1 | Update your application so that it connects to a standalone PostgreSQL database running in a Docker container. The configuration of your docker service should be included in the root of your git repository in the form of a **`docker-compose.yml`** file. | ✅ |
| 1 | Your application should already be configured with a code-first flow (from 
Programming 3). Verify that all of your database artifacts (tables, etc.) are created successfully when your app is launched. You may still have a leftover `schema.sql` file in your repository. If so, remove this file and, once again, verify that everything is working. | ✅ |
| 1 | Rewrite your data seeding so that data is seeded from an SQL file instead of your current Java routine. Remove any Java code related to data seeding. | ✅ |
| 1 | Refactor your many-to-many association(s) per the instructions in the course material. | ✅ |
| 1 | Update [`README.md`](https://gitlab.com/kdg-ti/programming-5/projects-24-25/acs202/robert.sargsyan/spring-backend/-/blob/main/README.md?ref_type=heads) file - add Week 1 required documentation. | ✅ |
| 1 | Enable logging for your SQL statements and test your application ⇾ Each page visit should ideally trigger only a single query. "Join fetch" can help with that. | ✅ |
| 1 | Disable eager loading, explicitly set the fetch type to LAZY and implement explicit loading of associated data using join fetch. | ✅ |
| 1 | Disable open session in view and declare your transactional boundaries at the level of the services. | ✅ |
| 1 | Disable cascading unless for very specific reasons that can be motivated. | ✅ |
| 2 | Implement at least one GET endpoint and one DELETE endpoint. | ✅ |
| 2 | Your endpoints should be called from JavaScript in a meaningful way. | ✅ |
| 2 | Add a .http file to your project in which you write HTTP request messages for each endpoint and possible response status code. | ✅ |
| 2 | Update [`README.md`](https://gitlab.com/kdg-ti/programming-5/projects-24-25/acs202/robert.sargsyan/spring-backend/-/blob/main/README.md?ref_type=heads) file - add Week 2 required documentation. | ✅ |
| 3 | Implement two more REST endpoints with different verbs so that these four verbs are implemented: GET, POST, PATCH, and DELETE. | ✅ |
| 3 | Use the validation framework to implement basic checks on the input. At least two constraints are acceptable, as long as you can easily trigger a 400 status code. | ✅ |
| 3 | Add MapStruct as a dependency and use it for your Web API backend code (you don't have to update your MVC code). Use MapStruct for trivial mappings and implement custom mapping logic for more complex mappings. | ✅ |
| 3 | You should call your endpoints from JavaScript in a meaningful way. | ✅ |
| 3 | Edit your .http file by adding request messages for each endpoint and each possible response status code (including 400, which is usually handled by Spring). | ⚠️ |
| 3 | Update [`README.md`](https://gitlab.com/kdg-ti/programming-5/projects-24-25/acs202/robert.sargsyan/spring-backend/-/blob/main/README.md?ref_type=heads) file - add Week 3 required documentation. | ✅ |
| 11 | Set up a separate project using npm, webpack, ESLint, and dprint. | ✅ |
| 11 | All styling should be done using Sass. Use at least two features from the SCSS syntax. Write idiomatic SCSS code. | ✅ |
| 11 | Add Bootstrap to your application and use Bootstrap components and layout features where possible. | ✅ |
| 11 | Customize Bootstrap. Simply choosing custom colors is acceptable. | ✅ |
| 11 | Create an HTML page with a navigation bar with at least these menu items: Search and Add. Implement 'SPA' (single-page application) functionality using your own JavaScript code: clicking a menu item should show the HTML section in question (Search or Add) and hide the other(s). | ✅ |
| 11 | Implement a new Web API endpoint (REST) in your Spring Boot backend to retrieve records based on at least one search term. | ✅ |
| 11 | Implement a form in your Client project to search for records. Using a fetch call, you should call the backend and process the response. | ✅ |
| 11 | Write your fetch call using async/await syntax, so not using 'then.’ | ✅ |
| 11 | Implement a new Web API endpoint (REST) in your Spring Boot backend to create a new record, that you cannot yet add through your REST API. | ✅ |
| 11 | Implement a form in your Client project to add a record. Using a fetch call, you should call the backend and process the response. | ✅ |
| 11 | In your backend, disable CSRF only for this endpoint. Add a comment to clarify that this is for the separate Client project. | ❌ |
| 11 | Enable CORS and only allow the origin that corresponds to your Client application.  | ⚠️ |
| 12 | Set up your embedded frontend project using npm and webpack. Follow all guidelines listed in the 13-step process. | ❌ |
| 12 | Migrate some of your stylings from CSS to SCSS syntax. Use at least two features from the SCSS syntax. Don't just rename your CSS files, but write idiomatic SCSS code. | ✅ |
| 12 | Customize Bootstrap using Sass. | ✅ |
| 12 | Migrate reusable JavaScript code into separate ECMAScript modules. | ✅ |
| 12 | Add ESLint and dprint configurations to your project and apply their suggestions. | ✅ |
| 12 | Add Bootstrap Icons using npm. Add at least one icon to your website. | ✅ |
| 12 | Add custom client-side form validation to at least one of your forms. Use the 'joi' or 'validator' npm package to implement this. | ✅ |
| 12 | Add at least two JavaScript dependencies of your choice to your project in addition to the ones listed above. | ✅ |
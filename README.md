# BudgetMate

Course Name: Programming 5

Full Name: Robert Sargsyan 

Student Id: 0165766-90

Email: robert.sargsyan.student.kdg.be

Domain Entities:

- Account
- User
- Budget
- Record
- RecordCategory
- AccountAdditionRequest
- EmailAuthToken

## Objective

BudgetMate is a web application which will help you to manage your finances and your family members expenses. BudgetMate provides a functionality to create multiple accounts, budgets and add different type of records such as expenses, incomes, and transfers between accounts. 

You can share your accounts with other users. Even though your balance will always be visible, you won’t have access to other users expense, income records. We provide an extensive search options for your records’ history as well extensive analytics for each month. This will help you to summarize monthly earnings and expenses.

## Application Stack

The application is divided into two main service [budgetmate-v2-api](https://gitlab.com/kdg-ti/programming-5/projects-24-25/acs202/robert.sargsyan/spring-backend) and [budgetmate-v2-app](https://gitlab.com/kdg-ti/programming-5/projects-24-25/acs202/robert.sargsyan/Client). 

The API service contains Rest APIs. The APIs are completely stateless, meaning that it uses JWT token to authenticate users. You can find quickly check the APIs markdown file here or open a documentation using this [link](http://app.budgetmate.com/swagger-ui/index.html). (Please note that the application should be run in order to open OpenAPI documentation). Our persistence layer which uses PostgreSQL follows all ACID principles.

The APP service contains the codebase for the application’s frontend. We currently use plain JS, CSS and HTML to support user interaction and the user interface in general but in the future we will migrate to React framework. 

The demo user account’s credentials are:

`email: user@budgetmate.com
password: user123`

## Get Started

In order to locally run the application you need to follow these steps:

1. Create a folder and name it `budgetmate` .
2. Clone [budgetmate-v2-api](https://gitlab.com/kdg-ti/programming-5/projects-24-25/acs202/robert.sargsyan/spring-backend)  or simply unzip the provided zip folder in `budgetmate` folder.
3. Clone [budgetmate-v2-app](https://gitlab.com/kdg-ti/programming-5/projects-24-25/acs202/robert.sargsyan/Client)  or simply unzip the provided zip folder in `budgetmate` folder.
4. Download [docker-compose.yaml](https://gitlab.com/kdg-ti/programming-5/projects-24-25/acs202/robert.sargsyan/spring-backend/-/blob/main/docker-compose.yaml?ref_type=heads) file and put it in `budgetmate` folder.
5. Run docker-compose.yaml file using `docker compose up -d`  command.

Once you have these steps done you will have access to the [landing](http://budgetmate.com/) web-page. Have a look on the landing web-page before logging into main application, it looks quite nice 😄

You access the main application through `login` button on the top navbar of the landing page or by following this [link](http://app.budgetmate.com/). There are credentials for the demo user’s account but you can try to register your own user account by following  `get started`  button on the top navbar. You need to provide your credentials after which we will send you an email to confirm that this is you and then you can log into your profile. **If you encounter an error during the registration step, it may be because the email vendor’s token has expired. Please contact me, and I will provide instructions for generating a new token.** 

## What BudgetMate does ?

There are 5 main sections in BudgetMate web application. All together support a complete functionality to manage your finances and expenses. 

The main page is `Dashboard` where you can quickly add new account, budget or record, as well as see all active accounts, and overview your monthly expenses, earnings, annual earning and overall outlook bar. Additionally, below you will find the analytics about last month’s expenses. On the top nav bar you can check you notifications and see current session’s history. 

In order to add an existing account of another user you need to provide the account’s name and another user’s username. Once the account’s owner accepts your request you will get an access to the account.

On the `Records History`  page you can search for your recents records, use advanced filtering and generate a report. If you click on one of the records you will be redirected to the record’s page where you can update or delete the record.

On the `Budgets`  page you can see you budgets, their current state and generate report for all your budgets.  If you click on one of the budgets you will be redirected to the budget’s page where you can update or delete the budget.

On the `Analytics`  page you can see the analytics for different months.

On the `Profile`  page you can update or delete your profile.
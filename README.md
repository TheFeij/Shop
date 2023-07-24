# Simple Shop
This project aims to implement a straightforward back-end system for registering products in the form of a simple online shop. The shop system allows users to manage their desired products through registration and logging into their user accounts.

# Features
### User Registration
In this section, users can create an account by providing the following information:
- Name and last name
- Email address
- Password
- Email address validation is required before completing the registration process.

### User Login
Users can log into the system using their email address and password.

### Product Creation
Logged-in users can create their own products.
Each product contains the following information:
- Product title
- Description related to the product

### Viewing Product Lists
Users can view their product list and all products created in the shop.
The product list is sorted based on their creation date.
Pagination is available for easy browsing of the product list.

# Detailed Description:
### Signup
Client sends firstname, lastname, email and password to the server. After validation is done,
the user is added to the database and a verification email is sent to the user's email.
At this point registration is not complete, and the user cannot log in because the account
is not verified yet. User checks their email inbox and clicks on the verification link, and their
account verification will be complete, and they can log in to their account

### Login
User logs in using a valid email and password. After that, a refreshing token in the response header
is sent to the client. Refreshing token has an expiration time of 12h. Client can use that refreshing
token to receive access tokens to use for authorization and authentication. Access tokens have an expiration 
time of 10m. When the refreshing token expires, the user needs to log in again in order to receive
another refreshing token

### Adding products
Logged-in users can add new products to the shop. Client sends information about the product, 
and after validations have been done, the product will be added to the shop.

### Displaying products
Logged-in users can receive a list of all products in the database or just their own products.
They can get the list sorted from new to old or old to new. They can also get the list paginated.
These options and For pagination the page size and page number are sent to the server via query
parameters.

# Possible features to be implemented
### Sending verification email again
Verification tokens sent to user via a verification email have an expiration time of
1 day. There is a possibility that a user cannot check their email and the verification token expires.
So there should be a feature that the user can receive another verification email

### Log out
A log-out feature should be implemented

### Limit for login attempts
There should be a limit for how many times a user can enter the wrong login information.
Implementing a feature to limit the amount of login tries for a certain IP address
is a must.

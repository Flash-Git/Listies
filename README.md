# Listies

[Listies](https://listies.herokuapp.com/) is a web app for creating, managing and sharing lists.

## Requirements

- [Node.js®](https://nodejs.org/en/download/) as the de facto standard JavaScript runtime.

- The scripts are built with [yarn](https://classic.yarnpkg.com/en/docs/install/) in mind but [npm](https://www.npmjs.com/get-npm) is fine.

## Features

- Dark Mode
- Accounts
- Automatic login
- List Sharing
- Importing/Exporting
- Dynamic User Interface
- Custom Ordering
- Alerts

## Technologies

### Backend

- Typescript
- Express server
- MongoDB
- Account management with bcrypt password hashing
- Token

### Frontend

- Typescript
- React.js version num (hooks)
- Routing
- Authentication

### Hosting

- Heroku

## Installation

Download the source code from the git repository:

```bash
git clone git@github.com:Flash-Git/Listies.git
```

Navigate to the root of the project and install the dependencies for both the client and server:

```bash
cd Listies
yarn devInstall
```

Start both the client and server:

```bash
yarn dev
```

Open your browser and navigate to your local address on port 3000:

<http://localhost:3000/>

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)

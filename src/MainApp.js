import React from 'react';
import {
	BrowserRouter as Router,
	Redirect,
	Route,
	Switch,
} from 'react-router-dom';

import LoginScreen from './containers/LoginScreen';
import MainScreen from './containers/MainScreen';
import SignUpScreen from './containers/SignUpScreen';
import PageNotFound from './containers/PageNotFound';

const MainApp = () => {
	return (
		<Router>
			<Switch>
				<Route path="/" exact>
					<Redirect to="/m" />
				</Route>
				<Route path="/m" component={MainScreen} />
				<Route path="/login" component={LoginScreen} />
				<Route path="/signup" component={SignUpScreen} />
				<Route path="*" component={PageNotFound} />
			</Switch>
		</Router>
	);
};

export default MainApp;

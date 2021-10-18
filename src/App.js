import { Provider } from 'react-redux';

import MainApp from './MainApp';
import store from './store/store';

function App() {
	return (
		<Provider store={store}>
			<MainApp />
		</Provider>
	);
}

export default App;

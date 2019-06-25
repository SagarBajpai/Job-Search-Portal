import React, {Suspense} from 'react';
import './App.css';
import Home from './components/Home/Home';
const OtherComponent = React.lazy(() => import('./components/Home/Home'));
function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtherComponent />
    </Suspense>
  );
}

export default App;

import React from 'react';
import GlobalStyles from 'src/styles/global'
import ConnectButton from 'src/components/ConnectButton'

const App: React.FC = () => {
  return (
    <div className="App">
      <GlobalStyles />
      Safe Contract Proxy Kit Example
      <ConnectButton />
    </div>
  );
}

export default App;

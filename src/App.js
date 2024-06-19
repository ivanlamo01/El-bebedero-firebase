import './styles/App.css';
import './styles/footer.css';
import { BrowserRouter as Router} from 'react-router-dom';
import Public from './Routes/Public';

const style={
  body:{
    fontFamily:"'Visby CF',sansSerif",
  }
}

function App() {
  return (
    <div className="App" style={style.body}>
        <Router>
          <Public/>
        </Router>
    </div>
  );
}

export default App;

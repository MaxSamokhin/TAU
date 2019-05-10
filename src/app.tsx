import * as React from 'react';
import { Route, Switch, withRouter} from 'react-router-dom';
import './app.scss';
import NotFound from './pages/not-found/not-found';
import TauMainPage from './pages/tau-main/tau-main.page';

class App extends React.Component {
    constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <div className="app">
                <Switch>
                    <Route exact={true} path='/' component={TauMainPage}/>
                    <Route component={NotFound}/>
                </Switch>
            </div>
        );
    }
}

export default withRouter(App);

import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

class CrudApp extends React.Component {

    render() {
        let modelArr = Object.keys(this.props.models).map(key => this.props.models[key]).filter(model => model.paths)
        return (
            <Router {...this.props}>
                <>
                    <this.props.header {...this.props} />
                    <Switch>
                        {modelArr.map((model, i) => {
                            return model.paths.map((path, j) => <Route key={`route-${i}`} path={path.path} exact render={props => {
                                let modelInstance = new model({ ...this.props, ...props })
                                return <path.component {...props} model={modelInstance} />
                            }} />)
                        })}
                    </Switch>
                </>
            </Router >
        );
    }

}

export default CrudApp;

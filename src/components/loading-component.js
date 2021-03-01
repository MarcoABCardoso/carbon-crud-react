import React from 'react';
import { Loading } from 'carbon-components-react'

class LoadingComponent extends React.Component {

    loaderComponent = Loading
    hideUntilLoaded = false

    state = {
        loading: false
    }

    constructor(props) {
        super(props)
        this.originalRender = this.render
        this.originalComponentDidMount = this.componentDidMount
        this.render = function () {
            if (this.state.loading === undefined) return <></>
            return <>
                {this.state.loading && <this.loaderComponent />}
                {(!this.state.loading || !this.hideUntilLoaded) && this.originalRender()}
            </>
        }
        this.componentDidMount = async function () {
            await this.setLoading(true)
            this.originalComponentDidMount && await this.originalComponentDidMount()
            await this.setLoading(false)
        }
    }

    setLoading(value) {
        return new Promise(resolve => this.setState({ loading: value }, resolve))
    }
}

LoadingComponent.defaultProps = {
    loaderComponent: Loading,
    hideUntilLoaded: false
}

export default LoadingComponent
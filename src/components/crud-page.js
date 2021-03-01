import React from 'react'
import CrudTable from './crud-table'
import LoadingComponent from './loading-component'

class CrudPage extends LoadingComponent {

    state = {}

    render() {
        if (!this.state.model) return <></>
        return <>
            <h3>{this.state.model.title}</h3>
            <br />
            <CrudTable {...this.state.model} />
        </>
    }

    async componentDidMount() {
        await this.props.model.ready
        this.setState({ model: this.props.model })
    }
}


export default CrudPage
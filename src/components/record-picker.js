import React, { Component } from 'react';
import { ComboBox, FormLabel } from 'carbon-components-react';

const LOAD_TIMEOUT = 300

class RecordPicker extends Component {

    state = { records: [] }

    timeout = null

    render() {
        let selectedRecord = this.state.records.find(r => r.id === this.props.value)
        return (<>
            <FormLabel>{this.props.label}</FormLabel>
            <ComboBox
                placeholder={this.props.placeholder}
                initialSelectedItem={selectedRecord && selectedRecord.name}
                selectedItem={selectedRecord && selectedRecord.name}
                items={this.state.records.map(r => ({ label: r.name, value: r.id }))}
                onInputChange={value => this.loadComboOptions(value)}
                onChange={ev => this.props.onChange(ev.selectedItem && ev.selectedItem.value)}
                onFocus={ev => this.loadComboOptions(this.props.value)}
                invalid={this.props.invalid}
                invalidText={this.props.invalidText}
                disabled={this.props.disabled}
            />
        </>)
    }

    componentDidMount() {
        this.loadComboOptions(this.props.value)
    }

    async loadComboOptions(value) {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(async () => {
            let data = await this.props.fetchOptions(value)
            this.setState({ records: [{ id: null, name: "" }, ...data.rows] }, () => {
                let selectedRecord = data.rows.find(r => r.id === value)
                if (selectedRecord) this.props.onChange(selectedRecord.id)
            })
        }, LOAD_TIMEOUT);
    }

}

RecordPicker.defaultProps = {
    fetchOptions: (search) => ({ rows: [] })
}

export default RecordPicker
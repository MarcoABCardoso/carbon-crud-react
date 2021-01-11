import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import { FormLabel } from 'carbon-components-react';
require('codemirror/mode/javascript/javascript');

class JSONEditor extends Component {

    state = {
        error: null,
    }

    render() {
        return (<>
            <FormLabel>{this.props.labelText}</FormLabel>
            {this.state.error && <h5 style={{ color: "red" }}>{`Invalid JSON format: ${this.state.error}`}</h5>}
            <div style={{ borderWidth: "2px", borderColor: "red", borderStyle: this.state.error ? "solid" : "none" }}>
                <CodeMirror
                    value={JSON.stringify(this.props.value, null, 4)}
                    onChange={value => this.handleChange(value)}
                    options={{ theme: 'dracula', lineNumbers: true, tabSize: 1 }}
                />
            </div>
        </>)
    }

    handleChange(value) {
        try {
            let payloadJSON = JSON.parse(value)
            if (this.props.validate) this.props.validate(payloadJSON)
            this.props.onChange(payloadJSON)
            this.setState({ error: null })
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

}

JSONEditor.defaultProps = {
    onChange: () => { }
}

export default JSONEditor
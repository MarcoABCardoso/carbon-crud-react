import React, { Component } from 'react';
import { TextInput, TextArea, Select, SelectItem, RadioButtonGroup, RadioButton, Checkbox, Toggle, NumberInput, FileUploaderButton, DatePicker, DatePickerInput, Accordion, AccordionItem, Tooltip, FormLabel } from 'carbon-components-react'
import CodeMirror from 'react-codemirror';
import JSONEditor from './json-editor';
import RecordPicker from './record-picker'

class Form extends Component {

    state = {
        options: {}
    }

    render() {
        return (<span onKeyPress={this.props.onKeyPress}>
            {this.props.fields.map((field, i) => <div key={`field-${i}`}>
                {(!field.visible || field.visible(this.props.value)) && <>
                    {(field.type === "text" || field.type === "password") && <TextInput
                        id={`field-${Math.random()}`}
                        placeholder={field.placeholder}
                        labelText={this.getFieldLabel(field)}
                        name={field.key}
                        type={field.type}
                        value={this.props.value[field.key] || ""}
                        onChange={ev => this.handleFormUpdate(field.key, ev.target.value)}
                        invalid={field.invalid && field.invalid(this.props.value[field.key] || "")}
                        invalidText={field.invalidText}
                    />}
                    {field.type === "textarea" && <TextArea
                        id={`field-${Math.random()}`}
                        name={field.key}
                        labelText={this.getFieldLabel(field)}
                        value={this.props.value[field.key]}
                        onChange={ev => this.handleFormUpdate(field.key, ev.target.value)}
                        invalid={field.invalid && field.invalid(this.props.value[field.key])}
                        invalidText={field.invalidText}
                    />}
                    {field.type === "json" && <JSONEditor
                        id={`field-${Math.random()}`}
                        name={field.key}
                        labelText={this.getFieldLabel(field)}
                        value={this.props.value[field.key]}
                        onChange={json => this.handleFormUpdate(field.key, json)}
                        invalid={field.invalid && field.invalid(this.props.value[field.key])}
                        invalidText={field.invalidText}
                    />}
                    {field.type === "code" && <>
                        <FormLabel>{this.getFieldLabel(field)}</FormLabel>
                        <CodeMirror
                            value={this.props.value[field.key]}
                            defaultValue={this.props.value[field.key] || field.default}
                            onChange={value => this.handleFormUpdate(field.key, value)}
                            options={{ theme: 'dracula', lineNumbers: true, tabSize: 1 }}
                        />
                    </>}
                    {field.type === "select" && <Select
                        id={`field-${Math.random()}`}
                        name={field.key}
                        labelText={this.getFieldLabel(field)}
                        value={this.props.value[field.key]}
                        onChange={ev => this.handleFormUpdate(field.key, ev.target.value)}
                        invalid={field.invalid && field.invalid(this.props.value[field.key])}
                        invalidText={field.invalidText}
                    >
                        {(this.state.options[field.key] || field.options || []).map((option, j) =>
                            <SelectItem
                                key={`option-${j}`}
                                value={option.value}
                                text={option.label}
                            />
                        )}
                    </Select>}
                    {field.type === "radio" && <RadioButtonGroup
                        id={`field-${Math.random()}`}
                        name={`field-${Math.random()}`}
                        valueSelected={String(this.props.value[field.key])}
                        onChange={selected => this.handleFormUpdate(field.key, selected)}
                        invalid={field.invalid && field.invalid(this.props.value[field.key])}
                        invalidText={field.invalidText}
                    >
                        {(this.state.options[field.key] || field.options || []).map((option, j) =>
                            <RadioButton
                                key={`option-${j}`}
                                value={option.value}
                                labelText={option.label}
                            />
                        )}
                    </RadioButtonGroup>}
                    {field.type === "toggle" && <Toggle
                        id={`field-${Math.random()}`}
                        name={field.key}
                        labelText={this.getFieldLabel(field)}
                        toggled={this.props.value[field.key]}
                        onToggle={state => this.handleFormUpdate(field.key, state)}
                        invalid={field.invalid && field.invalid(this.props.value[field.key])}
                        invalidText={field.invalidText}
                    />}
                    {field.type === "checkbox" && <Checkbox
                        id={`field-${Math.random()}`}
                        name={field.key}
                        labelText={this.getFieldLabel(field)}
                        checked={this.props.value[field.key] || false}
                        onChange={checked => this.handleFormUpdate(field.key, checked)}
                        invalid={field.invalid && field.invalid(this.props.value[field.key])}
                        invalidText={field.invalidText}
                    />}
                    {field.type === "number" &&
                        <NumberInput
                            id={`field-${Math.random()}`}
                            name={field.key}
                            label={this.getFieldLabel(field)}
                            value={this.props.value[field.key]}
                            onChange={ev => this.handleFormUpdate(field.key, ev.imaginaryTarget.value)}
                            step={field.step}
                            max={field.max}
                            min={field.min}
                            invalid={field.invalid && field.invalid(this.props.value[field.key])}
                            invalidText={field.invalidText}
                        />}
                    {field.type === "file" && <FileUploaderButton
                        name={field.key}
                        labelText={this.getFieldLabel(field)}
                        onChange={ev => this.handleFormUpdate(field.key, ev.target.files[0])}
                    />}
                    {field.type === "recordpicker" && <RecordPicker
                        id={`field-${Math.random()}`}
                        label={this.getFieldLabel(field)}
                        name={field.key}
                        placeholder={field.placeholder}
                        fetchOptions={field.fetchOptions}
                        value={this.props.value[field.key]}
                        onChange={value => this.handleFormUpdate(field.key, value)} />}
                    {field.type === "date" &&
                        <DatePicker
                            name={field.key}
                            datePickerType="single"
                            dateFormat="Y-m-d"
                            onChange={(_, date) => this.handleFormUpdate(field.key, date)}
                            locale={navigator.language.slice(0, 2)}
                            value={this.props.value[field.key]}
                            invalid={field.invalid && field.invalid(this.props.value[field.key])}
                            invalidText={field.invalidText}
                        >
                            <DatePickerInput
                                id={`field-${Math.random()}`}
                                labelText={this.getFieldLabel(field)}
                                value={this.props.value[field.key]}
                            />
                        </DatePicker>}
                    {field.type === "daterange" &&
                        <DatePicker
                            datePickerType="range"
                            dateFormat='Y-m-d'
                            value={[this.props.value[field.key1], this.props.value[field.key2]]}
                            onChange={ch => {
                                this.handleFormUpdate(field.key1, ch[0].toISOString().slice(0, 10))
                                if (!ch[1]) return
                                setTimeout(() => this.handleFormUpdate(field.key2, (new Date(Number(ch[1]) + 8.64e+7)).toISOString().slice(0, 10)), 100);
                            }}
                            locale={navigator.language.slice(0, 2)}
                        >
                            <DatePickerInput
                                id="date-picker-input-id-start"
                                labelText={field.label1}
                            />
                            <DatePickerInput
                                id="date-picker-input-id-end"
                                labelText={field.label2}
                            />
                        </DatePicker>}

                    {field.type === "readonly" && field.component({
                        id: `field-${Math.random()}`,
                        ...(field.props || {}),
                    })}
                    {field.type === "form" && <Accordion>
                        <AccordionItem title={this.getFieldLabel(field)}>
                            <Form
                                {...this.props}
                                fields={field.fields}
                                value={this.props.value[field.key]}
                                onChange={value => this.handleFormUpdate(field.key, value)} />
                        </AccordionItem>
                    </Accordion>}
                    {field.type === "id" && this.props.value[field.key] && <span style={{ color: "lightgray", fontSize: "small" }}>
                        {this.getFieldLabel(field)}: {this.props.value[field.key]}
                    </span>}
                    {field.type === "custom" && field.component({
                        id: `field-${Math.random()}`,
                        name: field.key,
                        labelText: this.getFieldLabel(field),
                        value: this.props.value[field.key],
                        onChange: state => this.handleFormUpdate(field.key, state),
                        ...(field.props || {}),
                        invalid: field.invalid && field.invalid(this.props.value[field.key]),
                        invalidText: field.invalidText
                    })}
                    {!["none", "form"].includes(field.type) && this.props.fields.length > i + 1 && <><br /><br /></>}
                    {field.tooltip && field.tooltip(this.props)}
                </>}
            </div>)}
        </span>)
    }

    getFieldLabel(field) {
        let label = field.label || field.key
        return field.description ?
            <Tooltip triggerText={label}>{field.description}</Tooltip> :
            label
    }

    componentDidMount() {
        if (this.isMultipart()) this.props.onChange(new FormData())
        setTimeout(() => this.props.fields.map((field, i) => field.default !== undefined && this.handleFormUpdate(field.key, field.default)), 0);
    }

    handleFormUpdate(key, value) {
        if (!key || this.props.disabled) return
        if (this.isMultipart()) {
            let formData = new FormData()
            if (this.props.value.forEach)
                this.props.value.forEach((v, k) => {
                    if (k !== key)
                        formData.append(k, v)
                })
            else
                Object.keys(this.props.value).forEach(k => {
                    if (k !== key)
                        formData.append(k, this.props.value[k])
                })
            formData.append(key, value)
            formData.id = formData.get('id')
            this.props.onChange(formData)
        }
        else {
            this.props.onChange({ ...this.props.value, [key]: value })
        }
    }

    isMultipart() {
        return this.props.fields.reduce((acc, field) => field.type === "file" || acc, false)
    }

    clear() {
        this.props.value = {}
        return this.props.onChange({ search: "", created_after: undefined })
    }

}

Form.defaultProps = {
    value: {}
}

export default Form
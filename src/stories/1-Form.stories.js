import React from 'react';
import Form from '../components/form';
import { withKnobs, boolean, text, number, object } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";

const Story = {
  title: 'Form',
  component: Form,
  decorators: [withKnobs]
}

export default Story

class Wrapper extends React.Component {
  state = {
    form: {
      text_field: text('text_field', 'text value'),
      password_field: text('password_field', 'password value'),
      textarea_field: text('textarea_field', 'textarea value'),
      json_field: object('json_field', { json: 'value' }),
      code_field: object('code_field', "function () {}"),
      select_field: text('select_field', 'option_1'),
      radio_field: text('radio_field', 'option_2'),
      toggle_field: boolean('toggle_field', false),
      checkbox_field: boolean('checkbox_field', true),
      number_field: number('number_field', 10),
      date_field: text('date_field', '2020-01-01'),
      daterange_field_1: text('daterange_field_1', '2020-01-01'),
      daterange_field_2: text('daterange_field_2', '2020-01-01'),
    }
  }

  render() {
    return <Form
      fields={[
        { label: 'Text', key: 'text_field', type: 'text' },
        { label: 'Password', key: 'password_field', type: 'password' },
        { label: 'Textarea', key: 'textarea_field', type: 'textarea' },
        { label: 'Json', key: 'json_field', type: 'json' },
        { label: 'Code', key: 'code_field', type: 'code' },
        { label: 'Select', key: 'select_field', type: 'select', options: [{ label: "Option 1", value: "option_1" }, { label: "Option 2", value: "option_2" }] },
        { label: 'Radio', key: 'radio_field', type: 'radio', options: [{ label: "Option 1", value: "option_1" }, { label: "Option 2", value: "option_2" }] },
        { label: 'Toggle', key: 'toggle_field', type: 'toggle' },
        { label: 'Checkbox', key: 'checkbox_field', type: 'checkbox' },
        { label: 'Number', key: 'number_field', type: 'number' },
        { label: 'Recordpicker', key: 'recordpicker_field', type: 'recordpicker', fetchOptions: search => ({ rows: [{ id: "foo", name: "Foo" }, { id: "bar", name: "Bar" }].filter(item => item.id.includes((search || "").toLowerCase())) }) },
        { label: 'Date', key: 'date_field', type: 'date' },
        { label1: 'Daterange start', label2: 'Daterange end', key1: 'daterange_field_1', key2: 'daterange_field_2', type: 'daterange' },
      ]}
      value={this.state.form}
      onChange={(form) => { action('onChange')(form); this.setState({ form }) }}
    />
  }
}


export const FormStory = () => <Wrapper />


FormStory.story = {
  name: 'default',
};

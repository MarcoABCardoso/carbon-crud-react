import React from 'react';
import { withKnobs, boolean, array } from "@storybook/addon-knobs";
import { CrudTable } from '..';
import { action } from "@storybook/addon-actions";
import 'carbon-components/css/carbon-components.min.css';

const Story = {
  title: 'CrudTable',
  component: CrudTable,
  decorators: [withKnobs]
}

export default Story

class Wrapper extends React.Component {
  state = {
    rows: [
      { id: 1, name: "My first project", createdAt: new Date().toUTCString(), updatedAt: new Date().toUTCString() },
      { id: 2, name: "My second project", createdAt: new Date().toUTCString(), updatedAt: new Date().toUTCString() },
      { id: 3, name: "My third project", createdAt: new Date().toUTCString(), updatedAt: new Date().toUTCString() },
      { id: 4, name: "My fourth project", createdAt: new Date().toUTCString(), updatedAt: new Date().toUTCString() },
    ],
    index: 5
  }

  async list(options) { action('list')(options); return { rows: this.state.rows.slice(options.offset, options.limit + options.offset), count: this.state.rows.length } }
  async create(options) { action('create')(options); this.setState({ rows: [...this.state.rows, { id: this.state.index, name: options.name, createdAt: new Date().toUTCString(), updatedAt: new Date().toUTCString() }], index: this.state.index + 1 }) }
  async update(options) { action('update')(options); this.setState({ rows: this.state.rows.map(r => r.id === options.id ? { ...r, name: options.name, updatedAt: new Date().toUTCString() } : r) }) }
  async del(options) { action('delete')(options); this.state.rows = this.state.rows.filter(r => r.id !== options.id) }

  render() {
    return <CrudTable
      list={this.list.bind(this)}
      create={this.create.bind(this)}
      update={this.update.bind(this)}
      delete={this.del.bind(this)}
      fields={[
        { label: 'Name', key: 'name', type: 'text', invalid: name => !name || !name.match(/^[a-zA-Z _0-9]+$/) },
      ]}
      headers={[
        { header: 'Name', key: 'name', type: 'text', searchable: true },
        { header: 'Created at', key: 'createdAt', sortable: boolean('Sortable (header.sortable)', true) },
        { header: 'Updated at', key: 'updatedAt', sortable: boolean('Sortable (header.sortable)', true) }
      ]}
      rowOptions={[
        { text: "Action 1 (normal)", onClick: action('Action 1') },
        { text: "Action 2 (batch)", onClick: action('Action 2'), batch: true },
        { text: "Action 3 (confirm)", onClick: action('Action 3'), confirm: true },
        { text: "Action 4 (condition)", onClick: action('Action 4'), batch: true, condition: row => row.id % 2 === 0 },
      ]}
      selectable={boolean('Selectable (selectable)', true)}
      searchable={boolean('Searchable (searchable)', true)}
      pageSizes={array('Page sizes (pageSizes)', [10, 50, 100, 1])}
    />
  }
}


export const CrudTableStory = () => <Wrapper />

CrudTableStory.story = {
  name: 'default',
};

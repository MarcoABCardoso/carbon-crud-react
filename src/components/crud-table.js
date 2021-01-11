import React, { Component } from 'react';
import { CrudTableProps, CrudTableState } from '..'
import { DataTable, DataTableSkeleton, Pagination, OverflowMenu, OverflowMenuItem, Modal, Icon, Button } from 'carbon-components-react';
import { iconSettings, iconDelete } from "carbon-icons"
import Form from './form';
const {
    TableContainer, Table, TableHead, TableRow, TableBody,
    TableCell, TableHeader, TableSelectRow, TableSelectAll, TableToolbar, TableToolbarSearch, TableExpandHeader,
    TableExpandRow, TableExpandedRow, TableBatchActions, TableToolbarContent, TableBatchAction
} = DataTable


/**
 * @extends {Component<CrudTableProps, CrudTableState>}}
 * @property {CrudTableState} state
 */
class CrudTable extends Component {

    constructor(props) {
        super(props)
        this.state = {
            limit: this.props.pageSizes[0],
            offset: 0,
            rows: [],
            search: {},
            formData: {},
            loading: false,
        }
    }

    render() {
        return (<>
            {!this.state.loading ?
                <DataTable
                    rows={this.state.rows} headers={this.props.headers} radio={this.props.radio}
                    render={props => (
                        <TableContainer style={this.props.style}>
                            {this.renderTableToolbar(props)}
                            <Table>
                                {this.renderTableHead(props)}
                                {this.renderTableBody(props)}
                            </Table>
                        </TableContainer>
                    )}
                /> :
                <DataTableSkeleton style={this.props.style} />
            }
            <Pagination
                pageInputDisabled={this.props.rowCount > 10000}
                totalItems={this.state.rowCount}
                pageSizes={this.props.pageSizes}
                onChange={({ page, pageSize }) => this.handlePaginationChange({ limit: pageSize, offset: pageSize * (page - 1) })}
            />
            <Modal
                open={this.state.dangerModalOpen}
                primaryButtonText={this.props.confirmButtonText}
                secondaryButtonText={this.props.cancelButtonText}
                danger={true}
                focusTrap={true}
                modalHeading="Are you sure?"
                onRequestSubmit={ev => {
                    this.setState({ loading: true })
                    this.state.dangerFunc()
                        .finally(() => this.setState({ loading: false }))
                }}
                onRequestClose={ev => this.setState({ dangerModalOpen: false })}
            >
                {this.props.dangerModalContent && this.props.dangerModalContent(this)}
            </Modal>
            <Modal
                disabled
                open={this.state.modalOpen}
                primaryButtonText={this.props.submitButtonText}
                secondaryButtonText={this.props.cancelButtonText}
                passiveModal={this.state.loading}
                onRequestSubmit={async () => {
                    for (let field of this.props.fields)
                        if (field.invalid && field.invalid(this.state.formData[field.key])) return
                    this.setState({ loading: true })
                    await (this.state.formData.id ? this.props.update(this.state.formData) : this.props.create(this.state.formData))
                    this.setState({ loading: false })
                    this.loadResources()
                    this.setState({ modalOpen: false, formData: {}, loading: false })
                }}
                onRequestClose={ev => this.setState({ modalOpen: false })}
                large={this.props.fields.find(f => f.type === "custom")}
            >
                <Form
                    fields={this.props.fields}
                    value={this.state.formData}
                    onChange={formData => this.setState({ formData })}
                />
            </Modal>
        </>)
    }

    renderTableToolbar(props) {
        return <TableToolbar>
            <TableToolbarContent>
                {this.props.searchable && <TableToolbarSearch persistant value={this.state.tempSearch} onChange={ev => this.handleSearchChange(ev.target.value)} />}
                {this.props.toolbarContent}
                {this.props.create && <Button onClick={ev => this.setState({ modalOpen: true, formData: {} })}>{this.props.addButtonText}</Button>}
            </TableToolbarContent>
            <TableBatchActions {...props.getBatchActionProps()}>
                {this.props.rowOptions
                    .filter(link => link.condition ? props.selectedRows.reduce((allAllowed, row) => allAllowed && link.condition(row), true) : true)
                    .filter(link => link.batch)
                    .map(link =>
                        <TableBatchAction
                            onClick={ev => this.setState({
                                dangerModalOpen: true,
                                dangerFunc: () => Promise.all(props.selectedRows.map(row => link.onClick(this.state.rows.find(r => r.id === row.id))))
                                    .catch(() => { })
                                    .then(() => this.setState({ dangerModalOpen: false }))
                                    .then(() => this.loadResources())
                            })}
                            renderIcon={() => <Icon style={{ marginLeft: "0.5rem" }} fill="white" icon={iconSettings} />}
                        >
                            {link.text}
                        </TableBatchAction>
                    )}
                <TableBatchAction
                    onClick={ev => this.setState({
                        dangerModalOpen: true,
                        dangerFunc: () => Promise.all(props.selectedRows.map(row => this.props.delete(row)))
                            .then(() => this.setState({ dangerModalOpen: false }))
                            .then(() => this.loadResources())
                    })}
                    renderIcon={() => <Icon style={{ marginLeft: "0.5rem" }} fill="white" icon={iconDelete} />}
                >
                    Delete
                </TableBatchAction>
                {this.props.batchActions && this.props.batchActions(props.selectedRows.map(s => this.props.rows.find(r => r.id === s.id)))}
            </TableBatchActions>
        </TableToolbar>

    }

    renderTableHead(props) {
        return <TableHead>
            <TableRow>
                {this.props.renderDetail && <TableExpandHeader />}
                {this.props.selectable && (this.props.radio ? <TableExpandHeader /> : <TableSelectAll {...props.getSelectionProps()} />)}
                {this.props.headers.map((header, i) => (
                    <TableHeader key={`header-${i}`} {...props.getHeaderProps({ header })} isSortHeader={header.key === this.state.sortHeader} sortDirection={this.state.order ? this.state.order.toUpperCase() : 'NONE'} isSortable={header.sortable} {...(this.handleSortChange ? { onClick: ev => this.handleSortChange(header.key, { asc: 'desc', desc: 'none', none: 'asc', }[this.state.order || 'none']) } : {})}>
                        {header.header}
                    </TableHeader>
                ))}
                <TableHeader />
            </TableRow>
        </TableHead >

    }

    renderTableBody(props) {
        let RowType = this.props.renderDetail ? TableExpandRow : TableRow
        return <TableBody>
            {props.rows.map((row, i) => <>
                <RowType {...props.getRowProps({ row })}>
                    {this.props.selectable && <TableSelectRow {...props.getSelectionProps({ row })} />}
                    {row.cells.map((cell, j) => <TableCell key={`cell-${j}`}> {cell.value} </TableCell>)}
                    <TableCell>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            {this.props.rowOptions.length > 0 && <OverflowMenu floatingMenu={true} flipped>
                                {this.props.rowOptions
                                    .filter(link => link.condition ? link.condition(this.state.rows.find(r => r.id === row.id)) : true)
                                    .map((link, i) => <OverflowMenuItem
                                        key={`link-${i}`}
                                        itemText={link.text}
                                        onClick={async () => {
                                            if (link.confirm)
                                                this.setState({
                                                    dangerModalOpen: true,
                                                    dangerFunc: async () => {
                                                        this.setState({ loading: true, dangerModalOpen: false })
                                                        await link.onClick(this.state.rows.find(r => r.id === row.id))
                                                        this.loadResources()
                                                    }
                                                })
                                            else {
                                                await link.onClick(this.state.rows.find(r => r.id === row.id))
                                                this.loadResources()
                                            }
                                        }}
                                    />
                                    )}
                                {this.props.update && <OverflowMenuItem
                                    itemText="Edit"
                                    onClick={() => {
                                        this.setState({ formData: this.state.rows.find(i => i.id === row.id), modalOpen: true })
                                    }} />}
                                {this.props.delete && <OverflowMenuItem
                                    itemText="Delete"
                                    hasDivider
                                    isDelete
                                    onClick={() => {
                                        this.setState({
                                            dangerModalOpen: true,
                                            dangerFunc: async () => {
                                                await this.props.delete(row)
                                                this.loadResources()
                                                this.setState({ dangerModalOpen: false })
                                            }
                                        })
                                    }} />}
                            </OverflowMenu>}
                        </div>
                    </TableCell>
                </RowType>
                {row.isExpanded && this.props.renderDetail && (
                    <TableExpandedRow colSpan={999}>
                        {this.props.renderDetail(this.state.rows[i])}
                    </TableExpandedRow>
                )}
            </>)}
        </TableBody>
    }

    componentDidMount() {
        this.loadResources()
    }

    async loadResources() {
        this.setState({ loading: true })
        let data = await this.props.list({
            limit: this.state.limit,
            offset: this.state.offset,
            order_by: this.state.order_by,
            order: this.state.order,
            ...this.state.search
        })
        this.setState({ rows: data.rows, rowCount: data.count, loading: false })
    }

    handlePaginationChange(change) {
        this.setState(change, () => this.loadResources())
    }

    handleSortChange(header, sortDirection) {
        this.setState({ order_by: header, order: sortDirection === 'none' ? null : sortDirection, sortHeader: header },
            () => this.loadResources()
        )
    }

    handleSearchChange(search) {
        this.setState({ tempSearch: search })
        clearTimeout(this.searchTimeout)
        this.searchTimeout = setTimeout(() => this.loadResources(), 1000)
        this.setState({
            search,
            offset: 0
        })
    }

    hasOverflowOptions() {
        return this.props.rowOptions.length > 0
    }

}

CrudTable.defaultProps = {
    list: (options) => [],
    create: (options) => { },
    update: (options) => { },
    delete: (options) => { },
    fields: [],
    rowOptions: [],
    pageSizes: [10, 50, 100],
    addButtonText: "Add",
    cancelButtonText: "Cancel",
    confirmButtonText: "Confirm",
    submitButtonText: "Submit",
}

export default CrudTable
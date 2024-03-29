import React, { Component } from 'react';
import { DataTable, DataTableSkeleton, Pagination, OverflowMenu, OverflowMenuItem, Modal, Icon, Button, ToastNotification, Link } from 'carbon-components-react';
import { iconSettings, iconDelete } from "carbon-icons"
import Form from './form';
const {
    TableContainer, Table, TableHead, TableRow, TableBody,
    TableCell, TableHeader, TableSelectRow, TableSelectAll, TableToolbar, TableToolbarSearch, TableExpandHeader,
    TableExpandRow, TableExpandedRow, TableBatchActions, TableToolbarContent, TableBatchAction
} = DataTable


class CrudTable extends Component {

    constructor(props) {
        super(props)
        this.state = {
            limit: this.props.pageSizes[0],
            offset: 0,
            rows: [],
            search: "",
            formData: {},
            loading: false,
            notification: null,
        }
    }

    render() {
        return (<>
            {this.anyModalOpen() && setTimeout(() => window.document.body.scrollTo(0, 0), 10) && setTimeout(() => window.scrollTo(0, 0), 20) && <style dangerouslySetInnerHTML={{ __html: `html, body {margin: 0; height: 100%; overflow: hidden}` }}></style>}
            {this.state.notification && <ToastNotification
                style={{ position: 'absolute', top: 0, right: 0, margin: "1rem", zIndex: 9999 }}
                timeout={5000}
                kind={this.state.notification.kind}
                onCloseButtonClick={ev => this.setState({ notification: null })}
                title={this.state.notification.title || ""}
                subtitle={""}
                caption={this.state.notification.caption || ""}
            />}
            {!this.state.loading ?
                <DataTable
                    rows={this.props.rows || (this.props.clientPagination) ? this.state.rows
                        .sort((row1, row2) => {
                            if (!this.state.sortHeader) return null
                            let a = row1[this.state.sortHeader]
                            let b = row2[this.state.sortHeader]
                            if (isNaN(a) || isNaN(b)) return 2 * Number(this.state.order === 'asc' ? a > b : a < b) - 1
                            else return this.state.order === 'asc' ? a - b : b - a
                        })
                        .filter(row => (this.state.search && !this.props.forceSearch) ? JSON.stringify(row).toLowerCase().includes((this.state.search.search || "").toLowerCase()) : true)
                        .filter((_, i) => i >= this.state.offset && i < this.state.offset + this.state.limit) :
                        this.state.rows
                    }
                    headers={this.props.headers} radio={this.props.radio}
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
                disabled={this.props.rowCount > 10000}
                totalItems={this.props.clientPagination && !this.props.forceSearch ? this.state.rows.filter(row => JSON.stringify(row).toLowerCase().includes(this.state.search && (this.state.search.search || "").toLowerCase())).length : this.state.rowCount}
                pageSizes={this.props.pageSizes}
                onChange={({ page, pageSize }) => this.handlePaginationChange({ limit: pageSize, offset: pageSize * (page - 1) })}
            />
            <Modal
                open={this.state.detailModalOpen}
                passiveModal
                onRequestClose={ev => this.setState({ detailModalOpen: false })}
            >
                {this.state.detailModalOpen && this.state.detailModalContent}
            </Modal>
            <Modal
                open={this.state.dangerModalOpen}
                primaryButtonText={this.props.confirmButtonText}
                secondaryButtonText={this.props.cancelButtonText}
                danger={true}
                modalHeading={this.props.areYouSureText}
                onRequestSubmit={ev => {
                    this.setState({ loading: true })
                    this.state.dangerFunc()
                }}
                onRequestClose={ev => this.setState({ dangerModalOpen: false })}
            >
                {this.props.dangerModalContent && this.props.dangerModalContent(this)}
            </Modal>
            <Modal
                primaryButtonDisabled={this.props.fields.find(field => field.invalid && field.invalid(this.state.formData[field.key]))}
                open={this.state.modalOpen}
                primaryButtonText={this.props.submitButtonText}
                secondaryButtonText={this.props.cancelButtonText}
                passiveModal={this.state.loading}
                onRequestSubmit={async () => {
                    this.setState({ loading: true })
                    await (this.state.formData.id ? this.props.update(this.state.formData) : this.props.create(this.state.formData))
                        .then(() => this.setState({ notification: { kind: 'success', title: this.props.submitSuccessText, caption: "" } }))
                        .catch(err => this.setState({ notification: { kind: 'error', title: this.props.submitErrorText, caption: this.props.formatErrorMessage(err) } }))
                    this.loadResources()
                    this.setState({ modalOpen: false, formData: {} })
                }}
                onRequestClose={ev => this.setState({ modalOpen: false })}
                size={this.props.modalSize}
            >
                {this.state.modalOpen && <Form
                    fields={this.props.fields}
                    value={this.state.formData}
                    onChange={formData => this.setState({ formData }, () => this.props.onFormUpdate(formData))}
                />}
            </Modal>
        </>)
    }

    renderTableToolbar(props) {
        return <TableToolbar>
            <TableToolbarContent>
                {this.props.searchable && <TableToolbarSearch onKeyPress={ev => ev.key === "Enter" && this.handleSearchChange({ ...this.state.search, search: this.state.tempSearch })} persistent value={this.state.tempSearch} onChange={ev => this.setState({ tempSearch: ev.target.value })} />}
                {this.props.toolbarContent}
                {this.props.create && <Button onClick={ev => this.setState({ modalOpen: true, formData: {} })}>{this.props.addButtonText}</Button>}
            </TableToolbarContent>
            <TableBatchActions {...props.getBatchActionProps()}>
                {this.props.rowOptions
                    .filter(link => link.condition ? props.selectedRows.reduce((allAllowed, row) => allAllowed && this.state.rows.find(r => r.id === row.id) && link.condition(this.state.rows.find(r => r.id === row.id)), true) : true)
                    .filter(link => link.batch)
                    .map((link, i) =>
                        <TableBatchAction
                            key={`batch-action-${i}`}
                            onClick={ev => this.setState({
                                dangerModalOpen: true,
                                dangerFunc: () => Promise.all(props.selectedRows.map(row => this.executeRowOption(row, link, false))).then(() => this.loadResources())
                            })}
                            renderIcon={() => <Icon description="Batch action" style={{ marginLeft: "0.5rem" }} fill="white" icon={iconSettings} />}
                        >
                            {link.text}
                        </TableBatchAction>
                    )}
                <TableBatchAction
                    onClick={ev => this.setState({
                        dangerModalOpen: true,
                        dangerFunc: () => Promise.all(props.selectedRows.map(row => this.deleteRow(row, false))).then(() => this.loadResources())
                    })}
                    renderIcon={() => <Icon description="Batch delete" style={{ marginLeft: "0.5rem" }} fill="white" icon={iconDelete} />}
                >
                    {this.props.deleteButtonText}
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
                    <TableHeader
                        key={`header-${i}`}
                        {...props.getHeaderProps({ header })}
                        isSortHeader={header.key === this.state.sortHeader}
                        sortDirection={this.state.order ? this.state.order.toUpperCase() : 'NONE'}
                        isSortable={header.sortable}
                        onClick={ev => { }}
                        onMouseDown={ev => {
                            if (header.sortable && !["INPUT", "SELECT"].includes(ev.target.tagName))
                                this.handleSortChange(header.key, { asc: 'desc', desc: 'none', none: 'asc', }[this.state.order || 'none'])
                        }}
                    >
                        {!header.searchable && header.header}
                        {header.searchable && <>
                            <Form
                                fields={[{ ...header, type: header.type === "id" ? "number" : header.type, label: " ", placeholder: header.header }]}
                                value={this.state.search}
                                onChange={change => this.setState({ search: { ...this.state.search, ...change } })}
                                onKeyPress={ev => ev.key === "Enter" && this.handleSearchChange(this.state.search)}
                            />
                        </>}
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
                <RowType key={`row-${i}`} {...props.getRowProps({ row })} style={{ cursor: "pointer" }}>
                    {this.props.selectable && <TableSelectRow {...props.getSelectionProps({ row })} />}
                    {row.cells.map((cell, j) => <TableCell
                        onClick={ev => this.handleClickRow(row)}
                        key={`cell-${j}`}>
                        {this.props.headers[j].detail ? <Link style={{ cursor: 'pointer' }} onClick={ev => this.setState({ detailModalContent: this.props.headers[j].detail(this.state.rows.find(r => r.id === row.id)), detailModalOpen: true })}>{this.props.headers[j].parse ? this.props.headers[j].parse(cell.value) : cell.value}</Link> : this.props.headers[j].parse ? this.props.headers[j].parse(cell.value) : cell.value}
                    </TableCell>)}
                    <TableCell>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            {(this.props.rowOptions.length > 0 || this.props.update || this.props.delete) && <OverflowMenu flipped onClick={ev => { ev.preventDefault(); console.log(ev) }}>
                                {this.props.rowOptions
                                    .filter(link => (link.condition && this.state.rows.find(r => r.id === row.id)) ? link.condition(this.state.rows.find(r => r.id === row.id)) : true)
                                    .map((link, k) => <OverflowMenuItem
                                        key={`link-${k}`}
                                        itemText={link.text}
                                        onClick={async () => {
                                            if (link.confirm)
                                                this.setState({
                                                    dangerModalOpen: true,
                                                    dangerFunc: async () => this.executeRowOption(row, link)
                                                })
                                            else {
                                                this.executeRowOption(row, link)
                                            }
                                        }}
                                    />
                                    )}
                                {this.props.update && <OverflowMenuItem
                                    itemText={this.props.editButtonText}
                                    onClick={() => {
                                        let formData = this.state.rows.find(i => i.id === row.id)
                                        this.handleEditRow(formData)
                                    }} />}
                                {this.props.delete && <OverflowMenuItem
                                    itemText={this.props.deleteButtonText}
                                    hasDivider
                                    isDelete
                                    onClick={() => {
                                        this.setState({
                                            dangerModalOpen: true,
                                            dangerFunc: () => this.deleteRow(row)
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
        return this.props.list({
            limit: this.state.limit,
            offset: this.state.offset,
            order_by: this.state.order_by,
            order: this.state.order,
            ...this.state.search
        })
            .then(data => this.setState({ rows: data.rows, rowCount: data.count, loading: false }))
            .catch(err => this.setState({ notification: { kind: 'error', title: this.props.listErrorText, caption: this.props.formatErrorMessage(err) }, loading: false }))
    }

    async executeRowOption(row, option, reload = true) {
        this.setState({ loading: true })
        try {
            await option.onClick(this.state.rows.find(r => r.id === row.id))
            this.setState({ dangerModalOpen: false, notification: { kind: 'success', title: this.props.actionSuccessText, caption: "" } })
            if (reload) this.loadResources()
        } catch (err) {
            this.setState({ notification: { kind: 'error', title: this.props.actionErrorText, caption: this.props.formatErrorMessage(err) } })
        }
        this.setState({ loading: false })
    }

    async deleteRow(row, reload = true) {
        this.setState({ loading: true })
        try {
            await this.props.delete(this.state.rows.find(r => r.id === row.id))
            this.setState({ dangerModalOpen: false, notification: { kind: 'success', title: this.props.deleteSuccessText, caption: "" } })
            if (reload) this.loadResources()
        } catch (err) {
            this.setState({ notification: { kind: 'error', title: this.props.deleteErrorText, caption: this.props.formatErrorMessage(err) } })
        }
        this.setState({ loading: false })
    }

    handleEditRow(formData) {
        this.setState({ formData, modalOpen: true }, () => this.props.onFormUpdate(formData))
    }

    handleClickRow(row) {
        let formData = this.state.rows.find(i => i.id === row.id)
        if (this.props.onClickRow) return this.props.onClickRow(formData)
        if (this.props.update) return this.handleEditRow(formData)
    }

    handlePaginationChange(change) {
        this.setState(change, () => this.props.clientPagination ? null : this.loadResources())
    }

    handleSortChange(header, sortDirection) {
        this.setState({ order_by: header, order: sortDirection === 'none' ? null : sortDirection, sortHeader: header },
            () => this.props.clientPagination ? null : this.loadResources()
        )
    }

    handleSearchChange(search) {
        this.setState({ tempSearch: search.search })
        this.setState({
            search,
            offset: 0
        })
        if (this.props.clientPagination && !this.props.forceSearch) return
        setTimeout(() => this.loadResources(), 0)
    }

    hasOverflowOptions() {
        return this.props.rowOptions.length > 0
    }

    anyModalOpen() {
        return this.state.detailModalOpen || this.state.dangerModalOpen || this.state.modalOpen
    }

}

CrudTable.defaultProps = {
    onFormUpdate: (formData) => { },
    list: (options) => ({ rows: [], count: 0 }),
    headers: [],
    fields: [],
    rowOptions: [],
    pageSizes: [10, 50, 100],
    addButtonText: "Add",
    editButtonText: "Edit",
    deleteButtonText: "Delete",
    areYouSureText: "Are you sure?",
    cancelButtonText: "Cancel",
    confirmButtonText: "Confirm",
    submitButtonText: "Submit",
    submitSuccessText: "Resource created successfully",
    submitErrorText: "Error creating resource",
    deleteSuccessText: "Resource deleted successfully",
    deleteErrorText: "Error deleting resource",
    actionSuccessText: "Action executed successfully",
    actionErrorText: "Error executing action",
    listErrorText: "Error listing resources",
    formatErrorMessage: error => error.response ? (error.response.data.message || error.response.data.error) : (error.message || error.error),
}

export default CrudTable
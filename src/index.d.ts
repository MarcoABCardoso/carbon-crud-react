import React from 'react'
type CrudFieldType = 'text' | 'password' | 'textarea' | 'json' | 'select' | 'radio' | 'toggle' | 'checkbox' | 'number' | 'file' | 'objectpicker' | 'date' | 'daterange'
type CrudTableHeader = { header: string; key: string, sortable: boolean }
type CrudTableRowOption = { text: string, onClick: (object) => void, batch: boolean, confirm: boolean, condition: (object) => boolean }
type CrudFormField = { label: string, key: string, type: CrudFieldType, invalid: (any) => boolean }

declare interface CrudTableProps {
    /**
     * The table's headers
     */
    headers: CrudTableHeader[]
    /**
     * The form's fields
     */
    fields: CrudFormField[]
    /**
     * The options available on each row
     */
    rowOptions: CrudTableRowOption[]
    /**
     * Whether the table's rows should be selectable
     */
    selectable: boolean
    /**
     * Whether to add a search field
     */
    searchable: boolean
    /**
     * Whether to add an Export button
     */
    exportable: boolean
    /**
     * List of page sizes available
     */
    pageSizes: number[]
    /**
     * Cancel button label
     */
    cancelButtonText: string
    /**
     * Confirm button label
     */
    confirmButtonText: string
    /**
     * Submit button label
     */
    submitButtonText: string
    /**
     * Handler for catching changes to the form
     */
    onFormUpdate: (object) => void
    /**
     * Function that lists resources
     */
    list: (object) => Promise<object[]>
    /**
     * Function that creates a resource
     */
    create: (object) => Promise<object>
    /**
     * Function that updates a resource
     */
    update: (object) => Promise<object>
    /**
     * Function that deletes a resource
     */
    delete: (object) => Promise<object>
}
declare interface CrudTableState {
    limit: number
    offset: number
    rows: object[]
    search: any
    formData: any
    loading: boolean
}

declare class CrudTable extends React.Component<CrudTableProps, CrudTableState> { }

export {
    CrudTable, CrudTableProps, CrudTableState,
}

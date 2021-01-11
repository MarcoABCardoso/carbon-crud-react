type Record = { id: any }
type CrudFieldType = 'text' | 'password' | 'textarea' | 'json' | 'select' | 'radio' | 'toggle' | 'checkbox' | 'number' | 'file' | 'recordpicker' | 'date' | 'daterange'
type CrudTableHeader = { header: string; key: string, sortable: boolean }
type CrudTableRowOption = { text: string, onClick: function(Record), batch: boolean, confirm: boolean, condition: function(Record): boolean }
type CrudFormField = { label: string, key: string, type: CrudFieldType, invalid: function(any): boolean }

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
     * The advanced search options. Will omit search if null
     */
    advancedSearchOptions: AdvancedSearchProps
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
     * Function that lists resources
     */
    list: function(string, object): Record[]
    /**
     * Function that creates a resource
     */
    create: function(string, object): Record
    /**
     * Function that updates a resource
     */
    update: function(string, object): Record
    /**
     * Function that deletes a resource
     */
    delete: function(string, object): Record
}
declare interface CrudTableState {
    limit: number
    offset: number
    rows: Record[]
    search: any
    formData: any
    loading: boolean
}

declare class CrudTable extends React.Component<CrudTableProps, CrudTableState> { }

export {
    CrudTable, CrudTableProps, CrudTableState,
}

import React from 'react'
type FieldType = 'text' | 'password' | 'textarea' | 'json' | 'select' | 'radio' | 'toggle' | 'checkbox' | 'number' | 'file' | 'objectpicker' | 'date' | 'daterange'
type Header = { header: string; key: string, sortable: boolean }
type RowOption = { text: string, onClick: (object) => void, batch: boolean, confirm: boolean, condition: (object) => boolean }
type FormField = { label: string, key: string, type: FieldType, invalid: (any) => boolean }

declare interface CrudOptions {
    headers: Header[]
    fields: FormField[]
    rowOptions: RowOption[]
    selectable: boolean
    searchable: boolean
    pageSizes: number[]
    cancelButtonText: string
    confirmButtonText: string
    submitButtonText: string
    list: (object) => Promise<Record[]>
    create: (object) => Promise<Record>
    update: (object) => Promise<Record>
    delete: (object) => Promise<Record>
}

declare interface CrudTableState {
    limit: number
    offset: number
    rows: object[]
    search: any
    formData: any
    loading: boolean
}

declare class Model extends CrudOptions {
    static paths: { path: string, component: React.Component }[]
    setup(): Promise<void>
    params: object
    title: string
}

declare interface CrudAppProps {
    models: any,
    services: any,
    header: React.Component
}

declare interface CrudPageProps {
    model: Model,
}

declare class CrudApp extends React.Component<CrudAppProps, {}> { }
declare class CrudPage extends React.Component<CrudPageProps, {}> { }
declare class CrudTable extends React.Component<CrudOptions, CrudTableState> { }
declare class LoadingComponent extends React.Component<{}, {}> {
    loaderComponent: React.Component
    hideUntilLoaded: boolean
}

export { CrudApp, CrudPage, CrudTable, LoadingComponent, Model }

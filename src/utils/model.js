class BaseModel {
    constructor(options) {
        this.options = options
        this.services = options.services
        this.params = options.match.params
        this.push = path => options.history.push(`${options.location.pathname}${path}`)
        this.ready = new Promise(resolve => setTimeout(() => this.setup(options).then(resolve), 0))
    }

    async setup(options) { }
}



export default BaseModel

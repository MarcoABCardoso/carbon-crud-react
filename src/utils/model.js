class BaseModel {
    constructor(options) {
        this.options = options || {}
        this.services = (options && options.services) || {}
        this.params = (options && options.match && options.match.params) || {}
        this.push = path => options && options.history && options.history.push(`${options.location.pathname}${path}`)
        this.ready = new Promise(resolve => setTimeout(() => this.setup(options).then(resolve), 0))
    }

    async setup(options) { }
}



export default BaseModel

import {config} from '../../shared/config/config.js'
import {server} from '../../shared/server/server.js'

server.listen(config.port, () => console.log(`Listening on port ${config.port}`))
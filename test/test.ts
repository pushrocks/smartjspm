import 'typings-test'
import * as smartjspm from '../dist/index'

let testSmartjspm: smartjspm.SmartJspm

describe('smartjspm',function(){
    it('should install npm modules for browser use',function(){
        testSmartjspm = new smartjspm.SmartJspm({
            targetDir: __dirname,
            npmDevDir: __dirname
        })
        testSmartjspm.readNpmextraJspmDependencies(__dirname)
        testSmartjspm.installJspmTarget()
    })
})

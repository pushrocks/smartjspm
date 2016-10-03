import 'typings-test'
import * as smartjspm from '../dist/index'
import * as path from 'path'
import * as should from 'should'
import * as smartfile from 'smartfile'

let testSmartjspm: smartjspm.SmartJspm
let testTargetDir = path.join(__dirname, 'targetDir')

let testFileString = `
    import * as lik from 'lik'
    import * as q from 'q'
`

describe('smartjspm',function(){
    it('should create an instance of class Smartjspm',function(){
        testSmartjspm = new smartjspm.SmartJspm({
            targetDir: testTargetDir,
            npmDevDir: testTargetDir
        })
        should(testSmartjspm).be.instanceof(smartjspm.SmartJspm)
    })
    it('should read dependencies from npmextra.json and install into target dir',function(done) {
        this.timeout(60000)
        testSmartjspm.readNpmextraJspmDependencies(__dirname)
        testSmartjspm.installJspmTarget().then(() => { done() })
    })
    it('should install a bundled version for production', function(done){
        this.timeout(30000)
        smartfile.memory.toFsSync(testFileString,path.join(testTargetDir, 'main.js'))
        testSmartjspm.createBundle().then(() => { done() }).catch(err => { console.log(err) })
    })
})

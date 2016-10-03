"use strict";
require("typings-test");
const smartjspm = require("../dist/index");
const path = require("path");
const should = require("should");
const smartfile = require("smartfile");
process.env.CI = 'true';
let testSmartjspm;
let testTargetDir = path.join(__dirname, 'targetDir');
let testFileString = `
    import * as lik from 'lik'
    import * as q from 'q'
`;
describe('smartjspm', function () {
    it('should create an instance of class Smartjspm', function () {
        testSmartjspm = new smartjspm.SmartJspm({
            targetDir: testTargetDir,
            npmDevDir: testTargetDir
        });
        should(testSmartjspm).be.instanceof(smartjspm.SmartJspm);
    });
    it('should read dependencies from npmextra.json and install into target dir', function (done) {
        this.timeout(60000);
        testSmartjspm.readNpmextraJspmDependencies(__dirname);
        testSmartjspm.installJspmTarget().then(() => { done(); });
    });
    it('should install dependencies from npmextra.json to node_modules', function () {
        this.timeout(30000);
        testSmartjspm.installNpmDevDir();
    });
    it('should install a bundled version for production', function (done) {
        this.timeout(60000);
        smartfile.memory.toFsSync(testFileString, path.join(testTargetDir, 'main.js'));
        testSmartjspm.createBundle().then(() => { done(); }).catch(err => { console.log(err); });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHdCQUFxQjtBQUNyQiwyQ0FBMEM7QUFDMUMsNkJBQTRCO0FBQzVCLGlDQUFnQztBQUNoQyx1Q0FBc0M7QUFFdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFBO0FBRXZCLElBQUksYUFBa0MsQ0FBQTtBQUN0QyxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQTtBQUVyRCxJQUFJLGNBQWMsR0FBRzs7O0NBR3BCLENBQUE7QUFFRCxRQUFRLENBQUMsV0FBVyxFQUFDO0lBQ2pCLEVBQUUsQ0FBQyw4Q0FBOEMsRUFBQztRQUM5QyxhQUFhLEdBQUcsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDO1lBQ3BDLFNBQVMsRUFBRSxhQUFhO1lBQ3hCLFNBQVMsRUFBRSxhQUFhO1NBQzNCLENBQUMsQ0FBQTtRQUNGLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUM1RCxDQUFDLENBQUMsQ0FBQTtJQUNGLEVBQUUsQ0FBQyx5RUFBeUUsRUFBQyxVQUFTLElBQUk7UUFDdEYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNuQixhQUFhLENBQUMsNEJBQTRCLENBQUMsU0FBUyxDQUFDLENBQUE7UUFDckQsYUFBYSxDQUFDLGlCQUFpQixFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUM1RCxDQUFDLENBQUMsQ0FBQTtJQUNGLEVBQUUsQ0FBQyxnRUFBZ0UsRUFBQztRQUNoRSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ25CLGFBQWEsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO0lBQ3BDLENBQUMsQ0FBQyxDQUFBO0lBQ0YsRUFBRSxDQUFDLGlEQUFpRCxFQUFFLFVBQVMsSUFBSTtRQUMvRCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ25CLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFBO1FBQzdFLGFBQWEsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQzFGLENBQUMsQ0FBQyxDQUFBO0FBQ04sQ0FBQyxDQUFDLENBQUEifQ==
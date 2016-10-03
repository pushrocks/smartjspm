"use strict";
require("typings-test");
const smartjspm = require("../dist/index");
const path = require("path");
const should = require("should");
const smartfile = require("smartfile");
let testSmartjspm;
let testTargetDir = path.join(__dirname, 'targetDir');
let testFileString = `
    import * as lik from 'lik'
    import * as q from 'q'
`;
describe('smartjspm', function () {
    it('should install npm modules for browser use', function () {
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
    it('should install a bundled version for production', function (done) {
        this.timeout(30000);
        smartfile.memory.toFsSync(testFileString, path.join(testTargetDir, 'main.js'));
        testSmartjspm.createBundle().then(() => { done(); }).catch(err => { console.log(err); });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHdCQUFxQjtBQUNyQiwyQ0FBMEM7QUFDMUMsNkJBQTRCO0FBQzVCLGlDQUFnQztBQUNoQyx1Q0FBc0M7QUFFdEMsSUFBSSxhQUFrQyxDQUFBO0FBQ3RDLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFBO0FBRXJELElBQUksY0FBYyxHQUFHOzs7Q0FHcEIsQ0FBQTtBQUVELFFBQVEsQ0FBQyxXQUFXLEVBQUM7SUFDakIsRUFBRSxDQUFDLDRDQUE0QyxFQUFDO1FBQzVDLGFBQWEsR0FBRyxJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUM7WUFDcEMsU0FBUyxFQUFFLGFBQWE7WUFDeEIsU0FBUyxFQUFFLGFBQWE7U0FDM0IsQ0FBQyxDQUFBO1FBQ0YsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQzVELENBQUMsQ0FBQyxDQUFBO0lBQ0YsRUFBRSxDQUFDLHlFQUF5RSxFQUFDLFVBQVMsSUFBSTtRQUN0RixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ25CLGFBQWEsQ0FBQyw0QkFBNEIsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUNyRCxhQUFhLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQzVELENBQUMsQ0FBQyxDQUFBO0lBQ0YsRUFBRSxDQUFDLGlEQUFpRCxFQUFFLFVBQVMsSUFBSTtRQUMvRCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ25CLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFBO1FBQzdFLGFBQWEsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQzFGLENBQUMsQ0FBQyxDQUFBO0FBQ04sQ0FBQyxDQUFDLENBQUEifQ==
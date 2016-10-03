"use strict";
require("typings-test");
const smartjspm = require("../dist/index");
let testSmartjspm;
describe('smartjspm', function () {
    it('should install npm modules for browser use', function (done) {
        this.timeout(60000);
        testSmartjspm = new smartjspm.SmartJspm({
            targetDir: __dirname,
            npmDevDir: __dirname
        });
        testSmartjspm.readNpmextraJspmDependencies(__dirname);
        testSmartjspm.installJspmTarget().then(() => { done(); });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHdCQUFxQjtBQUNyQiwyQ0FBMEM7QUFFMUMsSUFBSSxhQUFrQyxDQUFBO0FBRXRDLFFBQVEsQ0FBQyxXQUFXLEVBQUM7SUFDakIsRUFBRSxDQUFDLDRDQUE0QyxFQUFDLFVBQVMsSUFBSTtRQUN6RCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ25CLGFBQWEsR0FBRyxJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUM7WUFDcEMsU0FBUyxFQUFFLFNBQVM7WUFDcEIsU0FBUyxFQUFFLFNBQVM7U0FDdkIsQ0FBQyxDQUFBO1FBQ0YsYUFBYSxDQUFDLDRCQUE0QixDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQ3JELGFBQWEsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDNUQsQ0FBQyxDQUFDLENBQUE7QUFDTixDQUFDLENBQUMsQ0FBQSJ9
"use strict";
require("typings-test");
const smartjspm = require("../dist/index");
let testSmartjspm;
describe('smartjspm', function () {
    it('should install npm modules for browser use', function () {
        testSmartjspm = new smartjspm.SmartJspm({
            targetDir: __dirname,
            npmDevDir: __dirname
        });
        testSmartjspm.readNpmextraJspmDependencies(__dirname);
        testSmartjspm.installJspmTarget();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHdCQUFxQjtBQUNyQiwyQ0FBMEM7QUFFMUMsSUFBSSxhQUFrQyxDQUFBO0FBRXRDLFFBQVEsQ0FBQyxXQUFXLEVBQUM7SUFDakIsRUFBRSxDQUFDLDRDQUE0QyxFQUFDO1FBQzVDLGFBQWEsR0FBRyxJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUM7WUFDcEMsU0FBUyxFQUFFLFNBQVM7WUFDcEIsU0FBUyxFQUFFLFNBQVM7U0FDdkIsQ0FBQyxDQUFBO1FBQ0YsYUFBYSxDQUFDLDRCQUE0QixDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQ3JELGFBQWEsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO0lBQ3JDLENBQUMsQ0FBQyxDQUFBO0FBQ04sQ0FBQyxDQUFDLENBQUEifQ==